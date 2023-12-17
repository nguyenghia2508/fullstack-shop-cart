import express, { Request, Response, NextFunction,Router } from 'express';
import Product from '../models/Product';
import getTime from '../public/js/getTime';
import User from '../models/User';
import userCart from '../models/userCart';
import getTotalPriceAndNumber from './getData';
import Rating from '../models/Rating';
// import checkUser from '../middleware/auth/checkUser';
import calculateAverageRating from '../function/calculateAverageRating';
import calculateRatingCounts from '../function/calculateRatingCounts';
import separateDecimal from '../function/separateDecimal';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const newLap: Object[] = [];
  const newPhone: Object[] = [];
  const newCam: Object[] = [];
  try {
      const products = await Product.find({}).sort({ date: -1, index: -1 });

      if (products) {
          for (const product of products) {
              const rt = await Rating.findOne({ productName: { $regex: `^${product.name}$`, $options: 'i' } }, { listReview: 1 });
              const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
              const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                rating: item.rating.toString(),
                count: item.count,
              }));
              const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
              const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));

              const pushToCategory = (categoryArray: Object[], category: string) => {
                  if (categoryArray.length < 5 && product.category === category) {
                      categoryArray.push({
                          id: product._id,
                          name: product.name,
                          price: product.price,
                          date: product.date,
                          category: product.category,
                          desc: product.desc,
                          detail: product.detail,
                          image: {
                              path: product.image.path,
                              name: product.image.name,
                              imageType: product.image.imageType
                          },
                          totalSold: product.totalSold,
                          count: rt ? rt.listReview.length : [],
                          averageRating,
                          integerPart,
                          decimalPart,
                      });
                  }
              };

              pushToCategory(newLap, 'Laptop');
              pushToCategory(newPhone, 'Smartphone');
              pushToCategory(newCam, 'Camera');
          }

          return res.status(200).json({ newLap, newPhone, newCam });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/getAllType', async (req: Request, res: Response, next: NextFunction) => {
  const typeList: { type: string }[] = [];
  const products = await Product.find({}).sort({ date: -1, index: -1 });
  if (products) {
    for (const product of products) {
      const index = typeList.findIndex((e) => e.type === product.category);
      if (index === -1) {
          typeList.push({ type: product.category });
      }
    }
    return res.status(200).json({ typeList });
  }
});

router.post('/search-item', async (req: Request, res: Response, next: NextFunction) => 
{
  const { item, category } = req.body;
  const infoProduct = await findProducts(item, category);
  return res.status(200).send({ state:"success", infoProduct, item, category });
})

router.post('/add/:id', async (req: Request, res: Response, next: NextFunction) => {
  const user = req.params.id;
  const action = req.body.action;

  const { name, price } = req.body.item;
  const productName = name, productNumber = req.body.productNumber ? req.body.productNumber : 1 , productPrice = price;

  const username: string = user;
  const product = await Product.findOne({ name: productName });

  if (!product) {
      return res.status(200).send({ code: '6', message: 'Product not found' });
  }

  if (action === 'add') {
      return handleAddToCart(username, productName, product, productNumber, productPrice, res);
  }

  return res.status(200).send({ code: '0', message: 'Invalid action' });
});

router.post('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
  const user = req.params.id;
  const action = req.body.action;

  const { productName } = req.body.item;

  // if (!user) {
  //     if (!action) {
  //         const { item, category } = req.body;
  //         const infoProduct = await findProducts(item, category);
  //         return res.status(200).send({ code: '3', infoProduct, item, category });
  //     }
  //     return res.status(200).send({ code: '2', message: 'Need to login' });
  // }

  const username: string = user;
  const product = await Product.findOne({ name: productName });

  if (!product) {
      return res.status(200).send({ code: '6', message: 'Product not found' });
  }

  if (action === 'delete') {
      return handleDeleteFromCart(username, productName, res);
  }

  return res.status(200).send({ code: '0', message: 'Invalid action' });
});

const handleAddToCart = async (username: string, productName: string, product: any, productNumber: number, productPrice: number, res: Response) => {
    const userCartInstance = new userCart({
        username,
        carts: [
            {
                productName,
                productNumber,
                productPrice,
                productImage: {
                    path: product.image.path,
                    name: product.image.name,
                    imageType: product.image.imageType,
                },
            },
        ],
    });

    try {
        const existingUserCart = await userCart.findOne({ username });

        if (existingUserCart) {
          const totalNumber = existingUserCart.carts.reduce((accum, item) => accum + item.productNumber, 0);
          const totalPrice = existingUserCart.carts.reduce((accum, item) => accum + item.productPrice * item.productNumber, 0);
          if (totalNumber > 9) {
              return res.status(200).send({ code: '1', message: "Can only buy 10 items at a time",state:'false'});
          }

          const cartItem = existingUserCart.carts.find((item) => item.productName === productName);
          if (cartItem) {
              if (productNumber > product.number || productNumber + cartItem.productNumber > product.number) {
                  return res.status(200).send({ code: '7', message: "Can't buy more than the amount in stock",state:'false'});
              }
              if (productNumber + totalNumber > 10 ) {
                return res.status(200).send({ code: '8', message: "Your cart can only contain a maximum of 10 products",state:'false'});
              }

              await userCart.updateOne({username:username,"carts.productName" :productName},{"carts.$.productNumber": (cartItem.productNumber + productNumber)}).then((cp)=>{
                return res.status(200).send({
                  code: '4',
                  message: 'Success add to cart',
                  state:'success',
                  productName,
                  productNumber: cartItem.productNumber + productNumber,
                  totalNumber: totalNumber + productNumber,
                  totalPrice: totalPrice + Number(productPrice),
                });
              }).catch((err)=>{
                  console.log(err) 
              }) 
          } else {
              if (productNumber > product.number) {
                  return res.status(200).send({ code: '7', message: "Can't buy more than the amount in stock",state:'false'});
              }
              if (productNumber + totalNumber > 10 ) {
                return res.status(200).send({ code: '8', message: "Your cart can only contain a maximum of 10 products",state:'false'});
              }

              const newCartItem = {
                  productName,
                  productNumber,
                  productPrice,
                  productImage: {
                      path: product.image.path,
                      name: product.image.name,
                      imageType: product.image.imageType,
                  },
              };

              await userCart.updateOne({username:username},{ $push:{"carts":newCartItem}}).then(()=>{
                return res.status(200).send({
                  code: '5',
                  message: 'Success add to cart',
                  state:'success',
                  newCart: newCartItem,
                  totalNumber: totalNumber + productNumber,
                  totalPrice: totalPrice + Number(productPrice),
                });
              }).catch((err)=>{
                  console.log(err) 
              })     
          }
        } else {
            await userCartInstance.save();
            return res.status(200).send({ code: '3', message: 'Success add to cart', cart: userCartInstance.carts,state:'success' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: '8', message: 'Server error' });
    }
};

const handleDeleteFromCart = async (username: string, productName: string, res: Response) => {
    try {
        const userCartInstance = await userCart.findOne({ username });

        if (!userCartInstance) {
            return res.status(200).send({ code: '0', message: 'Cart is empty' });
        }

        const cartItem = userCartInstance.carts.find((item) => item.productName === productName);

        if (cartItem) {
            const nameToDelete = cartItem.productName
            const totalNumber = userCartInstance.carts.reduce((accum, item) => accum + item.productNumber, 0);
            const totalPrice = userCartInstance.carts.reduce((accum, item) => accum + item.productPrice * item.productNumber, 0);

            await userCart.updateOne({username:username},{ $pull: { carts: { productName: nameToDelete } } },{multi:true})

            return res.status(200).send({
                code: '0',
                state: "success",
                message: 'Delete success',
                productName,
                totalNumber: totalNumber - cartItem.productNumber,
                totalPrice: totalPrice - cartItem.productPrice * cartItem.productNumber,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: '8', message: 'Server error' });
    }
};
  
function findProducts(keyword: string, category: string) {
  return new Promise((resolve, reject) => {
    if (keyword === '') {
      // Trả về giá trị rỗng nếu keyword là chuỗi rỗng
      resolve([]);
    } else {
      const sanitizedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const query: any = {
        name: { $regex: sanitizedKeyword, $options: 'i' }
      };
      
      if (category.toLowerCase() !== 'all') {
        query.category = category;
      }

      Product.find(query)
        .sort({ date: -1, _id: -1 })
        .then((products) => {
          const infoProduct = products.map((c) => ({
            id: c._id,
            name: c.name,
            price: c.price,
            date: c.date,
            category: c.category,
            desc: c.desc,
            detail: c.detail,
            image: {
              path: c.image.path,
              name: c.image.name,
              imageType: c.image.imageType
            },
            totalSold: c.totalSold
          }));
          resolve(infoProduct);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}

module.exports = router