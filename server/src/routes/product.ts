import express, { Request, Response, NextFunction,Router } from 'express';
import Product from '../models/Product';
import User from '../models/User';
import userCart from '../models/userCart';
import Rating from '../models/Rating';
import getTime from "../public/js/getTime"
import calculateAverageRating from '../function/calculateAverageRating';
import calculateRatingCounts from '../function/calculateRatingCounts';
import formatDate from '../function/formatDate';
import nameUser from '../function/nameUser';
import paginateArray from '../function/paginateArray';
import separateDecimal from '../function/separateDecimal';

const router = Router();

/* GET home page. */
router.get('/:id/page/:page', async (req: Request, res: Response) => {
    try {
        const id = (req.params.id as string).replace(/-/g, ' ');
        const infoItem: any[] = [];
        const perPage = 4;
        const page : number = parseInt(req.params.page) ? parseInt(req.params.page) : 1

        const rt = await Rating.findOne({ productName: { $regex: `^${id}$`, $options: 'i' } }, { listReview: 1 });
        if (!rt || rt.listReview.length === 0) {
            const product = await Product.find({ name: { $regex: `^${id}$`, $options: 'i' } });

            if (!product || product.length === 0) {
                return res.status(200).render('product', {});
            }

            product.forEach((c) => {
                infoItem.push({
                    id: c._id,
                    name: c.name,
                    number: c.number,
                    price: c.price,
                    date: c.date,
                    category: c.category,
                    desc: c.desc,
                    detail: c.detail,
                    image: {
                        path: c.image.path,
                        name: c.image.name,
                        imageType: c.image.imageType,
                    },
                });
            });

            const user = req.query.user;
            const infoUser: any[] = [];
            const infoProduct: any[] = [];

            if (!user) {
                const u = await User.find({ username: user });

                u.forEach((c) => {
                    infoUser.push({
                        id: c._id,
                        fullname: c.fullname,
                        username: c.username,
                    });
                });

                const c = await userCart.findOne({ username: user });

                if (c) {
                    const totalPrice = c.carts.reduce((accum, item) => accum + item.productPrice * item.productNumber, 0);
                    const totalNumber = c.carts.reduce((accum, item) => accum + item.productNumber, 0);

                    c.carts.forEach((ct) => {
                        infoProduct.push({
                            productName: ct.productName,
                            productNumber: ct.productNumber,
                            productPrice: ct.productPrice,
                            productImage: {
                                path: ct.productImage.path,
                                name: ct.productImage.name,
                                imageType: ct.productImage.imageType,
                            },
                        });
                    });

                    return res.status(200).json({
                        infoUser,
                        totalPrice,
                        totalNumber,
                        infoProduct,
                        infoItem,
                    });
                } else {
                    return res.status(200).json({
                        infoUser,
                        infoItem,
                    });
                }
            } else {
                return res.status(200).json({
                    infoItem,
                });
            }
        } else {
            const count = rt.listReview.length;
            const totalPages: any[] = [];
            const pageTotal = Math.ceil(count / perPage);
            const currentpage : number = page

            const prevPage = Math.max(currentpage - 1, 1);
            const nextPage = Math.min(currentpage + 1, pageTotal);

            let prevP = 1;
            let nextP = pageTotal;

            if (pageTotal <= 6) {
                for (let i = 1; i <= pageTotal; i++) {
                    totalPages.push(i);
                }
            } else {
                totalPages.push(1);

                if (currentpage > 3) {
                    totalPages.push('...');
                }

                if (currentpage === pageTotal) {
                    totalPages.push(currentpage - 2);
                }

                if (currentpage > 2) {
                    totalPages.push(currentpage - 1);
                }

                if (currentpage !== 1 && currentpage !== pageTotal) {
                    totalPages.push(currentpage);
                }

                if (currentpage < pageTotal - 1) {
                    totalPages.push(currentpage + 1);
                }

                if (currentpage === 1) {
                    totalPages.push(currentpage + 2);
                }

                if (currentpage < pageTotal - 2) {
                    totalPages.push('...');
                }
                totalPages.push(pageTotal);
            }

            const listReview: any[] = [];
            rt.listReview.forEach((lt) => {
                listReview.push({
                    userReview: lt.userReview,
                    reviewPost: lt.reviewPost,
                    rating: lt.rating,
                    date: lt.date,
                });
            });
            
            const listReviewSlice = paginateArray(listReview, currentpage, perPage);
            const totalRating = calculateRatingCounts(listReview).reverse();
            const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                rating: item.rating.toString(),
                count: item.count,
            }));
            const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
            const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));

            const product = await Product.find({ name: { $regex: `^${id}$`, $options: 'i' } });

            if (!product || product.length === 0) {
                return res.status(200).render('product', {});
            }

            product.forEach((c) => {
                infoItem.push({
                    id: c._id,
                    name: c.name,
                    number: c.number,
                    price: c.price,
                    date: c.date,
                    category: c.category,
                    desc: c.desc,
                    detail: c.detail,
                    image: {
                        path: c.image.path,
                        name: c.image.name,
                        imageType: c.image.imageType,
                    },
                });
            });

            const user = req.query.user;
            const infoUser: any[] = [];
            const infoProduct: any[] = [];

            if (user) {
                const u = await User.find({ username: user });

                u.forEach((c) => {
                    infoUser.push({
                        id: c._id,
                        fullname: c.fullname,
                        username: c.username,
                    });
                });

                const c = await userCart.findOne({ username: user });

                if (c) {
                    const totalPrice = c.carts.reduce((accum, item) => accum + item.productPrice * item.productNumber, 0);
                    const totalNumber = c.carts.reduce((accum, item) => accum + item.productNumber, 0);

                    c.carts.forEach((ct) => {
                        infoProduct.push({
                            productName: ct.productName,
                            productNumber: ct.productNumber,
                            productPrice: ct.productPrice,
                            productImage: {
                                path: ct.productImage.path,
                                name: ct.productImage.name,
                                imageType: ct.productImage.imageType,
                            },
                        });
                    });

                    return res.status(200).json({
                        infoUser,
                        totalPrice,
                        totalNumber,
                        infoProduct,
                        infoItem,
                        currentpage,
                        totalPages,
                        prevPage,
                        nextPage,
                        prevP,
                        nextP,
                        pageTotal,
                        listReview: listReviewSlice,
                        totalRating,
                        averageRating,
                        integerPart,
                        decimalPart,
                        count,
                    });
                } else {
                    return res.status(200).json({
                        infoUser,
                        infoItem,
                        currentpage,
                        totalPages,
                        prevPage,
                        nextPage,
                        prevP,
                        nextP,
                        pageTotal,
                        listReview: listReviewSlice,
                        totalRating,
                        averageRating,
                        integerPart,
                        decimalPart,
                        count,
                    });
                }
            } else {
                return res.status(200).json({
                    infoItem,
                    currentpage,
                    totalPages,
                    prevPage,
                    nextPage,
                    prevP,
                    nextP,
                    pageTotal,
                    listReview: listReviewSlice,
                    totalRating,
                    averageRating,
                    integerPart,
                    decimalPart,
                    count,
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.query.user as string;
        const body = req.body;
        const perPage = 4;
        const page = 1;
        const id = (req.params.id).replace(/-/g, ' ');
        
        const userExists = await User.exists({ username: username });
        if (!body.rating) {
            res.status(200).send({ code: '11', message: 'Please choose your rating' ,state:'false'});
        }
        else if (!userExists)
        {
            res.status(200).send({ code: '15', message: 'You need to login' ,state:'false'});
        }

        const product = await Product.findOne({ name: { $regex: `^${id}$`, $options: 'i' } });

        if (!product) {
            res.status(200).send({ code: '13', message: 'Product not exists', state: 'false' });
        return;
        }

        const listReview = {
            userReview: await nameUser(username),
            reviewPost: body.reviewText,
            rating: body.rating,
            date: formatDate()
          };

        const updateResult = await Rating.updateOne({ productName: { $regex: `^${id}$`, $options: 'i' } },
            { $push: { listReview } }
        );

        if(updateResult)
        {
            const rt = await Rating.findOne({ productName: { $regex: `^${id}$`, $options: 'i' } }, { listReview: 1 });
            if(rt)
            {
                const count = rt.listReview?.length;
                const totalPages: (number | string)[] = [];
                const pageTotal = Math.ceil(count / perPage);
                const currentpage = page;
        
                if (pageTotal <= 6) {
                    for (let i = 1; i <= pageTotal; i++) {
                        totalPages.push(i);
                    }
                } else {
                    totalPages.push(1);
        
                    if (currentpage > 3) {
                        totalPages.push('...');
                    }
        
                    if (currentpage === pageTotal) {
                        totalPages.push(currentpage - 2);
                    }
        
                    if (currentpage > 2) {
                        totalPages.push(currentpage - 1);
                    }
        
                    if (currentpage !== 1 && currentpage !== pageTotal) {
                        totalPages.push(currentpage);
                    }
        
                    if (currentpage < pageTotal - 1) {
                        totalPages.push(currentpage + 1);
                    }
        
                    if (currentpage === 1) {
                        totalPages.push(currentpage + 2);
                    }
        
                    if (currentpage < pageTotal - 2) {
                        totalPages.push('...');
                    }
                    totalPages.push(pageTotal);
                }
        
                const listReview: any[] = rt.listReview.map((lt: any) => ({
                    userReview: lt.userReview,
                    reviewPost: lt.reviewPost,
                    rating: lt.rating,
                    date: lt.date
                }));
            
                const listReviewSlice = paginateArray(listReview, currentpage, perPage);
                const totalRating = calculateRatingCounts(listReview).reverse();
                const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                    rating: item.rating.toString(),
                    count: item.count,
                }));
                const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                res.status(200).send({ code: '10', message: 'Comment Success', 
                    listReviewSlice,
                    count, 
                    totalPages,
                    totalRating,
                    averageRating,
                    integerPart,
                    decimalPart,
                    state:'success'
                });    
            }
            else {
                res.status(404).send({ code: '404', message: 'Rating not found' ,state:'false'});
                return;
            }
        }
        else
        {
            res.status(404).send({ code: '404', message: 'Something wrong' ,state:'false'});
            return;
        }
    
    } catch (err) {
      console.log(err);
      res.status(500).send({ code: '500', message: 'Internal Server Error',state:'false'});
    }
});

// router.post('/:id/page/:page',  async function(req, res, next) {
//     var username = req.session.user
//     var body = req.body

//     var perPage = 4
    
//     var id = (req.params.id).replace(/-/g,' ')

//     if(username)
//     {
//         if(body.productNumber)
//         {
//             if(parseInt(body.productNumber) > 9)
//             {
//                 res.status(200).send({ code: '1',message:'Can only buy 10 items at a time' });
//             }
//             else
//             {
//                 Product.findOne({name:body.productName}).then((p)=>{
//                     let cart = new userCart({
//                         username:username,
//                         carts:[
//                             {
//                                 productName:body.productName,
//                                 productNumber:body.productNumber,
//                                 productPrice:p.price,
//                                 productImage:{
//                                     path:p.image.path,
//                                     name:p.image.name,
//                                     imageType:p.image.imageType
//                                 }
//                             }
//                         ]
//                     })
//                     userCart.findOne({username:username}).then((c) =>{
//                         if(c)
//                         {
//                             let totalNumber = c.carts.reduce((accum,item) => accum + item.productNumber, 0) + parseInt(body.productNumber)
//                             let totalPrice = c.carts.reduce((accum,item) => accum + item.productPrice * item.productNumber, 0) + 
//                             parseInt(body.productNumber) * p.price
//                             if(totalNumber > 10)
//                             {
//                                 res.status(200).send({ code: '6',message:'Can only buy 10 items at a time' });
//                             }
//                             else
//                             {
//                                 if (c.carts.filter(e => e.productName === body.productName).length > 0) {
//                                     let number = c.carts.find(e => e.productName === body.productName).productNumber
//                                     if(number > body.stockNumberLeft)
//                                     {
//                                         res.status(200).send({ code: '7',message:"Can't buy more than the amount in stock" });
//                                     }
//                                     else
//                                     {
//                                         userCart.updateOne({username:username,"carts.productName" :body.productName},{"carts.$.productNumber": parseInt(number + parseInt(body.productNumber))}).then((cp)=>{
//                                             res.status(200).send({ code: '4',message:'Success add to cart' ,productName:body.productName,productNumber:parseInt(number + parseInt(body.productNumber)),totalNumber:totalNumber,
//                                             totalPrice:totalPrice});
//                                         }).catch((err)=>{
//                                             console.log(err) 
//                                         })     
//                                     }
//                                 }
//                                 else
//                                 {
//                                     let newCart ={
//                                         productName:body.productName,
//                                         productNumber:body.productNumber,
//                                         productPrice:p.price,
//                                         productImage:{
//                                             path:p.image.path,
//                                             name:p.image.name,
//                                             imageType:p.image.imageType
//                                         }
//                                     }
//                                     userCart.updateOne({username:username},{ $push:{"carts":newCart}}).then(()=>{
//                                         res.status(200).send({ code: '5',message:'Success add to cart' ,newCart:newCart,totalNumber:totalNumber,
//                                         totalPrice:totalPrice});
//                                     }).catch((err)=>{
//                                         console.log(err) 
//                                     })     
//                                 }
//                             }
//                         }
//                         else
//                         {
//                             cart.save().then(()=>{
//                                 res.status(200).send({ code: '3',message:'Success add to cart' ,cart:cart.carts});
//                             }).catch((err)=>{
//                                 console.log(err) 
//                             })      
//                         }
//                     }).catch((err)=>{
//                         console.log(err) 
//                     }) 
//                 })
//             }
//         }
//         else
//         {
//             Rating.findOne({productName:{'$regex' : `^${id}$`, '$options' : 'i'}},{ "listReview": 1 }).then((rt) =>{
//                 let count = rt.listReview.length
//                 let totalPages = []
//                 let pageTotal = Math.ceil(count / perPage)
//                 let currentpage = parseInt(req.params.page)

//                 let prevPage = currentpage <= 1 ? 1 : currentpage - 1
//                 let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1

//                 let prevP = 1;
//                 let nextP = pageTotal;

//                 if (pageTotal <= 6) {
//                     for(var i = 1;i<=pageTotal;i++)
//                     {
//                         totalPages.push(i)
//                     }
//                 }
//                 else
//                 {
//                     totalPages.push(1)

//                     if (currentpage > 3) {
//                         totalPages.push("...");
//                     }

//                     if (currentpage == pageTotal) {
//                         totalPages.push(currentpage - 2);
//                     }

//                     if (currentpage > 2) {
//                         totalPages.push(currentpage - 1);
//                     }

//                     if (currentpage != 1 && currentpage != pageTotal) {
//                         totalPages.push(currentpage);
//                     }

//                     if (currentpage < pageTotal - 1) {
//                         totalPages.push(currentpage + 1);
//                     }
                
//                     // special case where first page is selected...
//                     if (currentpage == 1) {
//                         totalPages.push(currentpage + 2);
//                     }
                
//                     //print "..." if currentPage is < lastPage -2
//                     if (currentpage < pageTotal - 2) {
//                         totalPages.push("...");
//                     }
//                     totalPages.push(pageTotal)
//                 }
//                 console.log(currentpage)
//                 console.log(totalPages)

//                 let listReview = []
//                 var arr = rt.listReview.map(lt => {
//                     listReview.push({
//                         userReview: lt.userReview,
//                         reviewPost: lt.reviewPost,
//                         rating: lt.rating,
//                         date: lt.date
//                     })
//                 })
//                 let listReviewSlice = paginateArray(listReview,currentpage,perPage)

//                 if(!body.rating && !body.currentpages && !body.nextpages && !body.totalpages)
//                 {
//                     res.status(200).send({ code: '11',message:'Please choose your rating'});
//                 }
//                 else if(!body.rating && body.currentpages && body.nextpages && body.totalpages)
//                 {
//                     res.status(200).send({ code: '50',totalPages,
//                     prevPage,
//                     nextPage,
//                     prevP,
//                     nextP,
//                     pageTotal,
//                     listReview:listReviewSlice});
//                 }
//                 else
//                 {
//                     Product.exists({name:body.productName}).then((p) =>{
//                         if(p)
//                         {
//                             Rating.exists({productName:body.productName}).then((r) =>{
//                                 if(r)
//                                 {
//                                     (async () => {
//                                         let listReview = {
//                                         userReview: await nameUser(username),
//                                         reviewPost: body.postReview,
//                                         rating: body.rating,
//                                         date: formatDate()
//                                         };
                    
//                                         Rating.updateOne({ productName: body.productName }, { $push: { "listReview": listReview } }).then(() => {
//                                         res.status(200).send({ code: '10', message: 'Comment Success' });
//                                         });
//                                     })();
//                                 }
//                             }).catch((err)=>{
//                                 console.log(err) 
//                             }) 
//                         }
//                     }).catch((err)=>{
//                         console.log(err) 
//                     }) 
//                 }
//             })
//         }
//     }
//     else
//     {
//         Rating.findOne({productName:{'$regex' : `^${id}$`, '$options' : 'i'}},{ "listReview": 1 }).then((rt) =>{
//             let count = rt.listReview.length
//             let totalPages = []
//             let pageTotal = Math.ceil(count / perPage)
//             let currentpage = parseInt(req.params.page) + 1

//             let prevPage = currentpage <= 1 ? 1 : currentpage - 1
//             let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1

//             let prevP = 1;
//             let nextP = pageTotal;
//             for(var i = 1;i<=pageTotal;i++)
//             {
//                 totalPages.push(i)
//             }

//             let listReview = []
//             var arr = rt.listReview.map(lt => {
//                 listReview.push({
//                     userReview: lt.userReview,
//                     reviewPost: lt.reviewPost,
//                     rating: lt.rating,
//                     date: lt.date
//                 })
//             })
//             let listReviewSlice = paginateArray(listReview,currentpage - 1,perPage)
//             if(!body.rating && !body.currentpages && !body.nextpages && !body.totalpages)
//             {
//                 res.status(200).send({ code: '0',message:'Need to login' });
//             }
//             else if(!body.rating && body.currentpages && body.nextpages && body.totalpages)
//             {
//                 res.status(200).send({ code: '50',totalPages,
//                 prevPage,
//                 nextPage,
//                 prevP,
//                 nextP,
//                 pageTotal,
//                 listReview:listReviewSlice});
//             }
//         })
//     }
// });
  
module.exports = router;