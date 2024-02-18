import express, { Request, Response, NextFunction,Router } from 'express';
import { validationResult } from 'express-validator';
import registerValidator from '../middleware/validate/registerValidator';
import loginValidator from '../middleware/validate/loginValidator';
import billingValidator from '../middleware/validate/billingValidator';
import verifyUser from '../middleware/auth/verifyUser';
import checkUser from '../middleware/auth/checkUser';
import nodemailer from 'nodemailer';
import getTime from '../public/js/getTime';
import getTotalPriceAndNumber from './getData';
import jwt from 'jsonwebtoken';
import config from '../config/auth.config';
import mailHTML from '../mail/mailHTML'
import location from '../locale/location'
import { spawn } from 'child_process';
import Product from '../models/Product';
import User from '../models/User';
import userCart from '../models/userCart';
import Bill from '../models/Bill';
import Transactions from '../models/Transactions';
import path from 'path';

// import config from '../config/auth.config';
// import jwt from 'jsonwebtoken';

const router = Router();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    secure: false,
    requireTLS: false,
    port: 25,
    auth: {
        user: "noreply.electroshop@gmail.com",
        pass: "gsqahfmkbwytmvro",
    }
});

/* GET home page. */

router.post('/login', loginValidator, (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    const body = req.body;

    if (result.isEmpty()) {
        User.findOne({ username: body.username }).then(async (user) => {
            if (user) {
                if (body.password !== user.password) {
                    return res.status(401).json({
                      param: 'username',
                      state: 'false',
                      msg: 'Invalid username or password'
                    })
                } else {
                    // if(req.session)
                    // {
                    //   req.session.user = sessionUser
                    // }
                    const token = jwt.sign({ id: user._id }, config.secret, {
                        expiresIn: '24h',
                    });
                    res.status(200).json({ user, token })
                }
            } else {
                return res.status(401).json({
                  param: 'username',
                  state: 'false',
                  msg: 'Invalid username or password'
                })
            }
        });
    } else {
        const messages = result.array();
        const message = messages[0].msg;
        return res.status(401).json({
          param: 'username',
          state: 'false',
          msg: message
        })
    }
});

router.post('/register', registerValidator, (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        const body = req.body;

        const user = new User({
            fullname: body.fullname,
            username: body.username,
            email: body.email,
            password: body.password,
        });

        user.save().then(() => {
           return res.status(200).json({
              param: 'username',
              state: 'success',
              message: 'Register Success!'
            })
        }).catch((err) => {
            console.error(err);
        });
    } else {
        const messages = result.array();
        const message = messages[0].msg;
        return res.status(401).json({
          param: 'username',
          state: 'false',
          msg: message
        })
    }
});

router.post('/verify-token',verifyUser.verifyToken,
  (req: Request, res: Response) => {
    res.status(200).json({ user: req.user })
  }
)

router.get('/user-cart/:id',verifyUser.verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
      const user = req.params.id;
      const cart = user ? await userCart.findOne({ username: user }) : null;
      if (cart) {
        const result = await getTotalPriceAndNumber(cart.carts);
        return res.status(200).json({ result});
      }
      else
      {
        const userCartInstance = new userCart({
          username : user,
          carts: [],
        });
        userCartInstance.save()
        return res.status(200).json({});
      }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/recommend-product/:id', verifyUser.verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
      const user = req.params.id;
      const cart = user ? await userCart.findOne({ username: user }) : null;
      
      if (!cart || !cart.carts || cart.carts.length === 0) {
          return res.status(200).json({ data: [] });
      }
      
      const listTrans = await Transactions.find({}, 'listProduct');
      const listProduct = cart.carts.map(item => item.productID);

      const listTransJSON = JSON.stringify(listTrans.map(item => item.listProduct));
      const listProductJSON = JSON.stringify(listProduct);

      const pythonProcess = spawn('python3', ['python/fin_and_agrawal.py', listTransJSON, listProductJSON]);
      let responseData = '';
      const onDataReceived = (data: { toString: () => string; }) => {
          responseData += data.toString(); // Nối dữ liệu từ buffer
      };

      const onProcessClose = async (code: any) => {
          try {
              const parsedData = JSON.parse(responseData); // Phân tích chuỗi JSON
              if (parsedData.length > 0) {
                  const consequentProduct = parsedData[0][parsedData[0].indexOf('==>') + 1];
                  const recommendProduct = await Product.findOne({ productID: consequentProduct });
                  return res.status(200).json({ data: recommendProduct }); // Trả về kết quả dưới dạng JSON
              } else {
                  return res.status(200).json({ data: [] }); // Trả về một mảng rỗng nếu không có dữ liệu được phân tích
              }
          } catch (error) {
              console.error('Error parsing Python response:', error);
              return res.status(500).json({
                  param: 'recommend',
                  msg: 'Error parsing Python response'
              });
          }
      };

      const onErrorReceived = (data: any) => {
          console.error(`stderr: ${data}`);
          // Xử lý lỗi và gửi phản hồi lỗi chỉ một lần
          if (!res.headersSent) {
              res.status(500).json({
                  param: 'recommend',
                  msg: 'Something went wrong with the Python process'
              });
          }
      };

      pythonProcess.stdout.on('data', onDataReceived);
      pythonProcess.on('close', onProcessClose);
      pythonProcess.stderr.on('data', onErrorReceived);

  } catch (error) {
      console.error('Error in recommendation route:', error);
      return res.status(500).json({
          param: 'recommend',
          msg: 'Internal server error'
      });
  }
});

router.get('/check-out',verifyUser.verifyToken, (req: Request, res: Response, next: NextFunction) => {
    const user = req.query?.user;
    const infoUser: any[] = [];

    if (user) {
        User.find({ username: user }).then((u) => {
            const arr = u.map((c) => {
                infoUser.push({
                    id: c._id,
                    fullname: c.fullname,
                    username: c.username,
                });
            });

            userCart.findOne({ username: user }).then((c) => {
                if (c) {
                    getTotalPriceAndNumber(c.carts).then((result) => {
                        const { infoProduct, totalPrice, totalNumber } = result;

                        return res.status(200).json({
                            infoUser: infoUser,
                            totalPrice: totalPrice,
                            totalNumber: totalNumber,
                            infoProduct: infoProduct,
                        });
                    }).catch((error) => {
                        console.error(error);
                    });
                } else {
                    return res.status(200).json({
                        infoUser: infoUser,
                    });
                }
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }
});

router.post('/check-out', billingValidator,verifyUser.verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      try {
        const body = req.body;
        const user = req.query?.user;
        const cities = location;
  
        const userCartData = await userCart.findOne({ username: user });
  
        if (userCartData) {
          const { infoProduct, totalPrice, totalNumber } = await getTotalPriceAndNumber(userCartData.carts);
  
          if (totalNumber > 0) {
            const userData = await User.findOne({ username: user });
  
            if (userData) {
              let method: string;
  
              const loopProductInfor = (infoProduct: Object[] | undefined) => {
                let loopdata = '';
  
                if (infoProduct) {
                  infoProduct.forEach((c: any) => {
                    loopdata += `
                      <tr>
                        <td style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px;" width="75%" align="left">
                          ${c.productNumber}x ${c.productName}
                        </td>
                        <td style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px;" width="25%" align="left">
                          $${addDos(c.productPrice)}
                        </td>
                      </tr>
                    `;
                  });
                }
  
                return loopdata;
              };
  
              const creditCardBill = body.creditCardBill;
  
              const PayMethod = (creditCardBill: string) => {
                if (creditCardBill) {
                  method = 'Paypal System';
                } else {
                  method = 'Direct Payment';
                }
                return method;
              };
  
              const html = mailHTML(
                userData.fullname,
                loopProductInfor(infoProduct),
                body.addressBill,
                cities[body.cityBill],
                PayMethod(creditCardBill),
                addDos(totalPrice)
              );
              
              const listProduct = infoProduct.map(item => item.productID).sort((a: string,b: string) => a.localeCompare(b)).join(', ')
              const transaction = new Transactions({
                listProduct:listProduct
              })

              if (body.emailBill) {
                const mailOptions = {
                  from: 'Electro Shop <noreply.electroshop@gmail.com>',
                  to: body.emailBill,
                  subject: 'Order From Electro Shop',
                  html,
                };
  
                if (body.creditCardBill) {
                  const bill = new Bill({
                    username: user,
                    address: body.addressBill,
                    city: cities[body.cityBill],
                    emailReceive: body.emailBill,
                    dateCreate: new Date(),
                    telephone: body.telBill,
                    notes: body.notesBill,
                    methodPay: 'Paypal System',
                    carts: infoProduct,
                    totalNumber: totalNumber,
                    totalPrice: totalPrice,
                  });
  
                  await bill.save();
  
                  await userCart.deleteOne({ username: user });
                  
                  infoProduct.forEach(async (p: any) => {
                    const product = await Product.findOne({ name: p.productName });
  
                    if (product) {
                      const totalSold = isNaN(product.totalSold) ? 0 : product.totalSold;
                      await Product.updateOne(
                        { name: product.name },
                        {
                          $set: {
                            number: (product.number - p.productNumber),
                            totalSold: parseInt(totalSold + p.productNumber),
                          },
                        }
                      );
                    }
                  });
                  
                  // const existingTransaction = await Transactions.exists({listProduct:listProduct});
                  // if (!existingTransaction) {
                    await transaction.save()
                  // }

                  transporter.sendMail(mailOptions, (error: any, info: any) => {
                    if (error) {
                      console.log(error);
                    }
                    else
                    {
                      const message = 'We will send invoice information via email. Please check your mailbox';
                      
                      return res.status(200).json({
                        param: 'userCart',
                        state: 'success',
                        msg: message
                      })
                    }
                  });
  
                } else {
                  const bill = new Bill({
                    username: user,
                    address: body.addressBill,
                    city: cities[body.cityBill],
                    emailReceive: body.emailBill,
                    dateCreate: new Date(),
                    telephone: body.telBill,
                    notes: body.notesBill,
                    methodPay: 'Direct Payment',
                    carts: infoProduct,
                    totalNumber: totalNumber,
                    totalPrice: totalPrice,
                  });
  
                  await bill.save();
  
                  await userCart.deleteOne({ username: user });
  
                  infoProduct.forEach(async (p: any) => {
                    const product = await Product.findOne({ name: p.productName });
  
                    if (product) {
                      const totalSold = isNaN(product.totalSold) ? 0 : product.totalSold;
                      await Product.updateOne(
                        { name: product.name },
                        {
                          $set: {
                            number: (product.number - p.productNumber),
                            totalSold: parseInt(totalSold + p.productNumber),
                          },
                        }
                      );
                    }
                  });
                  
                  // const existingTransaction = await Transactions.exists({listProduct:listProduct});
                  // if (!existingTransaction) {
                    await transaction.save()
                  // }

                  transporter.sendMail(mailOptions, (error: any, info: any) => {
                    if (error) {
                      console.log(error);
                    }
                    else
                    {
                      const message = 'We will send invoice information via email. Please check your mailbox';
                      return res.status(200).json({
                        param: 'userCart',
                        state: 'success',
                        msg: message
                      })
                    }
                  });
                }
              } else {
                const mailOptions = {
                  from: 'Electro Shop <noreply.electroshop@gmail.com>',
                  to: userData.email,
                  subject: 'Order From Electro Shop',
                  html,
                };
  
                if (body.creditCardBill) {
                  const bill = new Bill({
                    username: user,
                    address: body.addressBill,
                    city: cities[body.cityBill],
                    emailReceive: userData.email,
                    dateCreate: new Date(),
                    telephone: body.telBill,
                    notes: body.notesBill,
                    methodPay: 'Paypal System',
                    carts: infoProduct,
                    totalNumber: totalNumber,
                    totalPrice: totalPrice,
                  });
  
                  await bill.save();
  
                  await userCart.deleteOne({ username: user });
  
                  infoProduct.forEach(async (p: any) => {
                    const product = await Product.findOne({ name: p.productName });
  
                    if (product) {
                      const totalSold = isNaN(product.totalSold) ? 0 : product.totalSold;
                      await Product.updateOne(
                        { name: product.name },
                        {
                          $set: {
                            number: (product.number - p.productNumber),
                            totalSold: parseInt(totalSold + p.productNumber),
                          },
                        }
                      );
                    }
                  });
                  
                  // const existingTransaction = await Transactions.exists({listProduct:listProduct});
                  // if (!existingTransaction) {
                    await transaction.save()
                  // }

                  transporter.sendMail(mailOptions, (error: any, info: any) => {
                    if (error) {
                      console.log(error);
                    }
                    const message = 'We will send invoice information via email. Please check your mailbox';
                    return res.status(200).json({
                      param: 'userCart',
                      state: 'success',
                      msg: message
                    })
                  });

                } else {
                  const bill = new Bill({
                    username: user,
                    address: body.addressBill,
                    city: cities[body.cityBill],
                    emailReceive: userData.email,
                    dateCreate: new Date(),
                    telephone: body.telBill,
                    notes: body.notesBill,
                    methodPay: 'Direct Payment',
                    carts: infoProduct,
                    totalNumber: totalNumber,
                    totalPrice: totalPrice,
                  });
  
                  await bill.save();
  
                  await userCart.deleteOne({ username: user });
  
                  infoProduct.forEach(async (p: any) => {
                    const product = await Product.findOne({ name: p.productName });
  
                    if (product) {
                      const totalSold = isNaN(product.totalSold) ? 0 : product.totalSold;
                      await Product.updateOne(
                        { name: product.name },
                        {
                          $set: {
                            number: (product.number - p.productNumber),
                            totalSold: parseInt(totalSold + p.productNumber),
                          },
                        }
                      );
                    }
                  });
                  
                  // const existingTransaction = await Transactions.exists({listProduct:listProduct});
                  // if (!existingTransaction) {
                    await transaction.save()
                  // }
                  
                  transporter.sendMail(mailOptions, (error: any, info: any) => {
                    if (error) {
                      console.log(error);
                    }
                    const message = 'We will send invoice information via email. Please check your mailbox';
                    return res.status(200).json({
                      param: 'userCart',
                      state: 'success',
                      msg: message
                    })
                  });
                }
              }
            }
          } else {
            const message = 'Your cart is empty';
  
            return res.status(401).json({
              param: 'userCart',
              msg: message
            })
          }
        } else {
          const message = 'Your cart is empty';
  
          return res.status(401).json({
            param: 'userCart',
            msg: message
          })
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const messages = result.array();
      const message = messages[0].msg;
      return res.status(401).json({
        param: 'userCart',
        msg: message
      })
    }
});

function addDos(value: number | string): string {
    const stringValue = value.toString();
    let x = stringValue.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2'); // changed comma to dot here
    }
    return x1 + x2;
}
  
  
module.exports = router;