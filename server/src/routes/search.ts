import express, { Request, Response, NextFunction,Router } from 'express';
import Product from '../models/Product';
import Rating from '../models/Rating';
import calculateAverageRating from '../function/calculateAverageRating';
import calculateRatingCounts from '../function/calculateRatingCounts';
import separateDecimal from '../function/separateDecimal';

const router = Router();

router.get('/page/:page',(req: Request, res: Response, next: NextFunction)  => {
    const perPage: number = 18
    , page = req.params.page ? parseInt(req.params.page) : 1

    const item = (req.query.item  as string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regnexCategory = (req.query.category as string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const category = regnexCategory.toLowerCase() ==='all' ? '' : req.query.category as string;
    Product.exists({}).then((pd) =>{
        if(pd)
        {   
            const infoProduct: any[] = [];
            
            if(category === '')
            {
                if(item === '')
                {
                    Product.find({})
                    .sort({date: -1, _id: -1}).clone()
                    .limit(perPage)
                    .skip(perPage * (page - 1))
                    .then(async (product) =>{
                        if(product.length)
                        { 
                            for (const c of product) {
                                const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                                const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                                const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                                    rating: item.rating.toString(),
                                    count: item.count,
                                }));
                                const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                                const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                                
                                infoProduct.push({
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
                                        imageType: c.image.imageType,
                                    },
                                    totalSold: c.totalSold,
                                    count: rt ? rt.listReview.length : [],
                                    averageRating,
                                    integerPart,
                                    decimalPart,
                                });
                            }

                            Product.count({}).exec().then((count) => {
                                if (count) {
                                    let totalPages: any[] = [];
                                    const pageTotal: number = Math.ceil(count / perPage);
                                    const currentpage: number = page;
                                    const prevPage: number = currentpage <= 1 ? 1 : currentpage - 1;
                                    const nextPage: number = currentpage >= pageTotal ? pageTotal : currentpage + 1;
                                    let prevP: number = 1;
                                    let nextP: number = pageTotal;

                                    if (pageTotal <= 6) {
                                    for (let i = 1; i <= pageTotal; i++) {
                                        totalPages.push(i);
                                    }
                                    } else {
                                    totalPages.push(1);

                                    if (currentpage > 3) {
                                        totalPages.push('...');
                                    }

                                    if (currentpage == pageTotal) {
                                        totalPages.push(currentpage - 2);
                                    }

                                    if (currentpage > 2) {
                                        totalPages.push(currentpage - 1);
                                    }

                                    if (currentpage != 1 && currentpage != pageTotal) {
                                        totalPages.push(currentpage);
                                    }

                                    if (currentpage < pageTotal - 1) {
                                        totalPages.push(currentpage + 1);
                                    }

                                    if (currentpage == 1) {
                                        totalPages.push(currentpage + 2);
                                    }

                                    if (currentpage < pageTotal - 2) {
                                        totalPages.push('...');
                                    }
                                    totalPages.push(pageTotal);
                                    }
                                    
                                    return res.status(200).json({
                                    infoProduct: infoProduct,
                                    currentpage,
                                    totalPages,
                                    prevPage,
                                    nextPage,
                                    prevP,
                                    nextP,
                                    pageTotal,
                                    perPage,
                                    });
                                }
                            });                        
                        }
                        else
                        {
                            return res.status(200).json({
                                message:"Not found item"
                            })
                        }
                    }).catch((error) => {
                        console.log(error)
                    })       
                }
                else
                {
                    Product.find({ name: { $regex: item, $options: 'i' }})
                    .sort({date: -1, _id: -1}).clone()
                    .limit(perPage)
                    .skip(perPage * (page - 1))
                    .then(async (product) =>{
                        if(product.length)
                        { 
                            for (const c of product) {
                                const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                                const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                                const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                                    rating: item.rating.toString(),
                                    count: item.count,
                                }));
                                const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                                const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                                
                                infoProduct.push({
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
                                        imageType: c.image.imageType,
                                    },
                                    totalSold: c.totalSold,
                                    count: rt ? rt.listReview.length : [],
                                    averageRating,
                                    integerPart,
                                    decimalPart,
                                });
                            }

                            Product.count({ name: { $regex: item, $options: 'i' }}).exec().then((count) => {
                                if (count) {
                                    let totalPages: any[] = [];
                                    const pageTotal: number = Math.ceil(count / perPage);
                                    const currentpage: number = page;
                                    const prevPage: number = currentpage <= 1 ? 1 : currentpage - 1;
                                    const nextPage: number = currentpage >= pageTotal ? pageTotal : currentpage + 1;
                                    let prevP: number = 1;
                                    let nextP: number = pageTotal;

                                    if (pageTotal <= 6) {
                                    for (let i = 1; i <= pageTotal; i++) {
                                        totalPages.push(i);
                                    }
                                    } else {
                                    totalPages.push(1);

                                    if (currentpage > 3) {
                                        totalPages.push('...');
                                    }

                                    if (currentpage == pageTotal) {
                                        totalPages.push(currentpage - 2);
                                    }

                                    if (currentpage > 2) {
                                        totalPages.push(currentpage - 1);
                                    }

                                    if (currentpage != 1 && currentpage != pageTotal) {
                                        totalPages.push(currentpage);
                                    }

                                    if (currentpage < pageTotal - 1) {
                                        totalPages.push(currentpage + 1);
                                    }

                                    if (currentpage == 1) {
                                        totalPages.push(currentpage + 2);
                                    }

                                    if (currentpage < pageTotal - 2) {
                                        totalPages.push('...');
                                    }
                                    totalPages.push(pageTotal);
                                    }
                                    
                                    return res.status(200).json({
                                    infoProduct: infoProduct,
                                    currentpage,
                                    totalPages,
                                    prevPage,
                                    nextPage,
                                    prevP,
                                    nextP,
                                    pageTotal,
                                    perPage,
                                    });
                                }
                            });                        
                        }
                        else
                        {
                            return res.status(200).json({
                                message:"Not found item"
                            })
                        }
                    }).catch((error) => {
                        console.log(error)
                    })        
                } 
            }
            else
            {
                if(item === '')
                {
                    Product.find({category:category})
                    .sort({date: -1, _id: -1}).clone()
                    .limit(perPage)
                    .skip(perPage * (page - 1))
                    .then(async (product) =>{
                        if(product.length)
                        { 
                            for (const c of product) {
                                const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                                const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                                const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                                    rating: item.rating.toString(),
                                    count: item.count,
                                }));
                                const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                                const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                                
                                infoProduct.push({
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
                                        imageType: c.image.imageType,
                                    },
                                    totalSold: c.totalSold,
                                    count: rt ? rt.listReview.length : [],
                                    averageRating,
                                    integerPart,
                                    decimalPart,
                                });
                            }

                            Product.count({category:category}).exec().then((count) => {
                                if (count) {
                                    let totalPages: any[] = [];
                                    const pageTotal: number = Math.ceil(count / perPage);
                                    const currentpage: number = page;
                                    const prevPage: number = currentpage <= 1 ? 1 : currentpage - 1;
                                    const nextPage: number = currentpage >= pageTotal ? pageTotal : currentpage + 1;
                                    let prevP: number = 1;
                                    let nextP: number = pageTotal;

                                    if (pageTotal <= 6) {
                                    for (let i = 1; i <= pageTotal; i++) {
                                        totalPages.push(i);
                                    }
                                    } else {
                                    totalPages.push(1);

                                    if (currentpage > 3) {
                                        totalPages.push('...');
                                    }

                                    if (currentpage == pageTotal) {
                                        totalPages.push(currentpage - 2);
                                    }

                                    if (currentpage > 2) {
                                        totalPages.push(currentpage - 1);
                                    }

                                    if (currentpage != 1 && currentpage != pageTotal) {
                                        totalPages.push(currentpage);
                                    }

                                    if (currentpage < pageTotal - 1) {
                                        totalPages.push(currentpage + 1);
                                    }

                                    if (currentpage == 1) {
                                        totalPages.push(currentpage + 2);
                                    }

                                    if (currentpage < pageTotal - 2) {
                                        totalPages.push('...');
                                    }
                                    totalPages.push(pageTotal);
                                    }
                                    
                                    return res.status(200).json({
                                    infoProduct: infoProduct,
                                    currentpage,
                                    totalPages,
                                    prevPage,
                                    nextPage,
                                    prevP,
                                    nextP,
                                    pageTotal,
                                    perPage,
                                    });
                                }
                            });                        
                        }
                        else
                        {
                            return res.status(200).json({
                                message:"Not found item"
                            })
                        }
                    }).catch((error) => {
                        console.log(error)
                    })       
                }
                else
                {
                    Product.find({ name: { $regex: item, $options: 'i' }},{category:category})
                    .sort({date: -1, _id: -1}).clone()
                    .limit(perPage)
                    .skip(perPage * (page - 1))
                    .then(async (product) =>{
                        if(product.length)
                        { 
                            for (const c of product) {
                                const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                                const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                                const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                                    rating: item.rating.toString(),
                                    count: item.count,
                                }));
                                const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                                const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                                
                                infoProduct.push({
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
                                        imageType: c.image.imageType,
                                    },
                                    totalSold: c.totalSold,
                                    count: rt ? rt.listReview.length : [],
                                    averageRating,
                                    integerPart,
                                    decimalPart,
                                });
                            }

                            Product.count({category:category,name: { $regex: item, $options: 'i' }}).exec().then((count) => {
                                if (count) {
                                    let totalPages: any[] = [];
                                    const pageTotal: number = Math.ceil(count / perPage);
                                    const currentpage: number = page;
                                    const prevPage: number = currentpage <= 1 ? 1 : currentpage - 1;
                                    const nextPage: number = currentpage >= pageTotal ? pageTotal : currentpage + 1;
                                    let prevP: number = 1;
                                    let nextP: number = pageTotal;

                                    if (pageTotal <= 6) {
                                    for (let i = 1; i <= pageTotal; i++) {
                                        totalPages.push(i);
                                    }
                                    } else {
                                    totalPages.push(1);

                                    if (currentpage > 3) {
                                        totalPages.push('...');
                                    }

                                    if (currentpage == pageTotal) {
                                        totalPages.push(currentpage - 2);
                                    }

                                    if (currentpage > 2) {
                                        totalPages.push(currentpage - 1);
                                    }

                                    if (currentpage != 1 && currentpage != pageTotal) {
                                        totalPages.push(currentpage);
                                    }

                                    if (currentpage < pageTotal - 1) {
                                        totalPages.push(currentpage + 1);
                                    }

                                    if (currentpage == 1) {
                                        totalPages.push(currentpage + 2);
                                    }

                                    if (currentpage < pageTotal - 2) {
                                        totalPages.push('...');
                                    }
                                    totalPages.push(pageTotal);
                                    }
                                    
                                    return res.status(200).json({
                                    infoProduct: infoProduct,
                                    currentpage,
                                    totalPages,
                                    prevPage,
                                    nextPage,
                                    prevP,
                                    nextP,
                                    pageTotal,
                                    perPage,
                                    });
                                }
                            });                        
                        }
                        else
                        {
                            return res.status(200).json({
                                message:"Not found item"
                            })
                        }
                    }).catch((error) => {
                        console.log(error)
                    })        
                } 
            }
        }
        else
        {
            return res.status(200).json({
                message:"Not found item"
            })
        }
    })
})


// router.post('/',(req,res,next) => {
//     const searchData = req.body;
//     console.log('body',searchData)
//     return res.redirect(`/search?item=${searchData.item}&category=${searchData.category}&idx=${searchData.idx}`)
// })

// router.post('/',(req,res,next) => {
//     const {category,item,idx,page} = req.query;
//     // console.log(req.query)
//     const body = req.body
//     const perPage = 18
//     let listProduct = []
//     if(item !== '')
//     {
//         if(category !== '')
//         {
//             Product.find({}).sort({date: -1, _id: -1})
//             .clone()
//             .limit(perPage)
//             .skip(perPage * (parseInt(body.nextpages))).then((product) =>{
//                 var arr = product.map(p =>{
//                     listProduct.push({
//                         id:p._id,
//                         name:p.name,
//                         price:p.price,
//                         date:p.date,
//                         category:p.category,
//                         image:{
//                             path:p.image.path,
//                             name:p.image.name,
//                             imageType:p.image.imageType
//                         },
//                         totalSold:p.totalSold
//                     })
//                 })
//                 Product.count({}).exec().then((count) => {
//                     if(count)
//                     {
//                         let totalPages = []
//                         let pageTotal = Math.ceil(count / perPage)
//                         let currentpage = parseInt(body.currentpages) + 1
            
//                         let prevPage = currentpage <= 1 ? 1 : currentpage - 1
//                         let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1
            
//                         let prevP = 1;
//                         let nextP = pageTotal;
//                         if (pageTotal <= 6) {
//                             for(var i = 1;i<=pageTotal;i++)
//                             {
//                                 totalPages.push(i)
//                             }
//                         }
//                         else
//                         {
//                             totalPages.push(1)
        
//                             if (currentpage > 3) {
//                                 totalPages.push("...");
//                             }
        
//                             if (currentpage == pageTotal) {
//                                 totalPages.push(currentpage - 2);
//                             }
        
//                             if (currentpage > 2) {
//                                 totalPages.push(currentpage - 1);
//                             }
        
//                             if (currentpage != 1 && currentpage != pageTotal) {
//                                 totalPages.push(currentpage);
//                             }
        
//                             if (currentpage < pageTotal - 1) {
//                                 totalPages.push(currentpage + 1);
//                             }
                        
//                             // special case where first page is selected...
//                             if (currentpage == 1) {
//                                 totalPages.push(currentpage + 2);
//                             }
                        
//                             //print "..." if currentPage is < lastPage -2
//                             if (currentpage < pageTotal - 2) {
//                                 totalPages.push("...");
//                             }
//                             totalPages.push(pageTotal)
//                         }
//                         res.status(200).send({ code: '10',listProduct:listProduct,
//                         currentpage,
//                         totalPages,
//                         prevPage,
//                         nextPage,
//                         prevP,
//                         nextP,
//                         pageTotal,
//                         perPage:perPage
//                         });
//                     }
//                     else
//                     {
//                         res.status(200).send({ code: '0',message:'Not found item'});
//                     }
//                 })
//             })
//             .catch((error) => {
//                 console.log(error)
//             })
//         }
//         else
//         {
//             Product.find({category:category}).sort({date: -1, _id: -1})
//             .clone()
//             .limit(perPage)
//             .skip(perPage * (parseInt(body.nextpages))).then((product) =>{
//                 var arr = product.map(p =>{
//                     listProduct.push({
//                         id:p._id,
//                         name:p.name,
//                         price:p.price,
//                         date:p.date,
//                         category:p.category,
//                         image:{
//                             path:p.image.path,
//                             name:p.image.name,
//                             imageType:p.image.imageType
//                         },
//                         totalSold:p.totalSold
//                     })
//                 })
//                 Product.count({category:category}).exec().then((count) => {
//                     if(count)
//                     {
//                         let totalPages = []
//                         let pageTotal = Math.ceil(count / perPage)
//                         let currentpage = parseInt(body.currentpages) + 1
            
//                         let prevPage = currentpage <= 1 ? 1 : currentpage - 1
//                         let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1
            
//                         let prevP = 1;
//                         let nextP = pageTotal;
//                         if (pageTotal <= 6) {
//                             for(var i = 1;i<=pageTotal;i++)
//                             {
//                                 totalPages.push(i)
//                             }
//                         }
//                         else
//                         {
//                             totalPages.push(1)
        
//                             if (currentpage > 3) {
//                                 totalPages.push("...");
//                             }
        
//                             if (currentpage == pageTotal) {
//                                 totalPages.push(currentpage - 2);
//                             }
        
//                             if (currentpage > 2) {
//                                 totalPages.push(currentpage - 1);
//                             }
        
//                             if (currentpage != 1 && currentpage != pageTotal) {
//                                 totalPages.push(currentpage);
//                             }
        
//                             if (currentpage < pageTotal - 1) {
//                                 totalPages.push(currentpage + 1);
//                             }
                        
//                             // special case where first page is selected...
//                             if (currentpage == 1) {
//                                 totalPages.push(currentpage + 2);
//                             }
                        
//                             //print "..." if currentPage is < lastPage -2
//                             if (currentpage < pageTotal - 2) {
//                                 totalPages.push("...");
//                             }
//                             totalPages.push(pageTotal)
//                         }
//                         res.status(200).send({ code: '10',listProduct:listProduct,
//                         currentpage,
//                         totalPages,
//                         prevPage,
//                         nextPage,
//                         prevP,
//                         nextP,
//                         pageTotal,
//                         perPage:perPage
//                         });
//                     }
//                     else
//                     {
//                         res.status(200).send({ code: '0',message:'Not found item'});
//                     }
//                 })
//             })
//             .catch((error) => {
//                 console.log(error)
//             })
//         }
//     }
//     else
//     {
//         if(category !== '')
//         {
//             Product.find({ name: { $regex: item, $options: 'i' }}).sort({date: -1, _id: -1})
//             .clone()
//             .limit(perPage)
//             .skip(perPage * (parseInt(body.nextpages))).then((product) =>{
//                 var arr = product.map(p =>{
//                     listProduct.push({
//                         id:p._id,
//                         name:p.name,
//                         price:p.price,
//                         date:p.date,
//                         category:p.category,
//                         image:{
//                             path:p.image.path,
//                             name:p.image.name,
//                             imageType:p.image.imageType
//                         },
//                         totalSold:p.totalSold
//                     })
//                 })
//                 Product.count({ name: { $regex: item, $options: 'i' }}).exec().then((count) => {
//                     if(count)
//                     {
//                         let totalPages = []
//                         let pageTotal = Math.ceil(count / perPage)
//                         let currentpage = parseInt(body.currentpages) + 1
            
//                         let prevPage = currentpage <= 1 ? 1 : currentpage - 1
//                         let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1
            
//                         let prevP = 1;
//                         let nextP = pageTotal;
//                         if (pageTotal <= 6) {
//                             for(var i = 1;i<=pageTotal;i++)
//                             {
//                                 totalPages.push(i)
//                             }
//                         }
//                         else
//                         {
//                             totalPages.push(1)
        
//                             if (currentpage > 3) {
//                                 totalPages.push("...");
//                             }
        
//                             if (currentpage == pageTotal) {
//                                 totalPages.push(currentpage - 2);
//                             }
        
//                             if (currentpage > 2) {
//                                 totalPages.push(currentpage - 1);
//                             }
        
//                             if (currentpage != 1 && currentpage != pageTotal) {
//                                 totalPages.push(currentpage);
//                             }
        
//                             if (currentpage < pageTotal - 1) {
//                                 totalPages.push(currentpage + 1);
//                             }
                        
//                             // special case where first page is selected...
//                             if (currentpage == 1) {
//                                 totalPages.push(currentpage + 2);
//                             }
                        
//                             //print "..." if currentPage is < lastPage -2
//                             if (currentpage < pageTotal - 2) {
//                                 totalPages.push("...");
//                             }
//                             totalPages.push(pageTotal)
//                         }
//                         res.status(200).send({ code: '2',listProduct:listProduct,
//                         currentpage,
//                         totalPages,
//                         prevPage,
//                         nextPage,
//                         prevP,
//                         nextP,
//                         pageTotal,
//                         perPage:perPage
//                         });
//                     }
//                     else
//                     {
//                         res.status(200).send({ code: '0',message:'Not found item'});
//                     }
//                 })
//             })
//             .catch((error) => {
//                 console.log(error)
//             })
//         }
//         else
//         {
//             Product.find({ name: { $regex: item, $options: 'i' }},{category:category}).sort({date: -1, _id: -1})
//             .clone()
//             .limit(perPage)
//             .skip(perPage * (parseInt(body.nextpages))).then((product) =>{
//                 var arr = product.map(p =>{
//                     listProduct.push({
//                         id:p._id,
//                         name:p.name,
//                         price:p.price,
//                         date:p.date,
//                         category:p.category,
//                         image:{
//                             path:p.image.path,
//                             name:p.image.name,
//                             imageType:p.image.imageType
//                         },
//                         totalSold:p.totalSold
//                     })
//                 })
//                 Product.count({ name: { $regex: item, $options: 'i' }},{category:category}).exec().then((count) => {
//                     if(count)
//                     {
//                         let totalPages = []
//                         let pageTotal = Math.ceil(count / perPage)
//                         let currentpage = parseInt(body.currentpages) + 1
            
//                         let prevPage = currentpage <= 1 ? 1 : currentpage - 1
//                         let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1
            
//                         let prevP = 1;
//                         let nextP = pageTotal;
//                         if (pageTotal <= 6) {
//                             for(var i = 1;i<=pageTotal;i++)
//                             {
//                                 totalPages.push(i)
//                             }
//                         }
//                         else
//                         {
//                             totalPages.push(1)
        
//                             if (currentpage > 3) {
//                                 totalPages.push("...");
//                             }
        
//                             if (currentpage == pageTotal) {
//                                 totalPages.push(currentpage - 2);
//                             }
        
//                             if (currentpage > 2) {
//                                 totalPages.push(currentpage - 1);
//                             }
        
//                             if (currentpage != 1 && currentpage != pageTotal) {
//                                 totalPages.push(currentpage);
//                             }
        
//                             if (currentpage < pageTotal - 1) {
//                                 totalPages.push(currentpage + 1);
//                             }
                        
//                             // special case where first page is selected...
//                             if (currentpage == 1) {
//                                 totalPages.push(currentpage + 2);
//                             }
                        
//                             //print "..." if currentPage is < lastPage -2
//                             if (currentpage < pageTotal - 2) {
//                                 totalPages.push("...");
//                             }
//                             totalPages.push(pageTotal)
//                         }
//                         res.status(200).send({ code: '2',listProduct:listProduct,
//                         currentpage,
//                         totalPages,
//                         prevPage,
//                         nextPage,
//                         prevP,
//                         nextP,
//                         pageTotal,
//                         perPage:perPage
//                         });
//                     }
//                     else
//                     {
//                         res.status(200).send({ code: '0',message:'Not found item'});
//                     }
//                 })
//             })
//             .catch((error) => {
//                 console.log(error)
//             })
//         }
//     }
// })

module.exports = router