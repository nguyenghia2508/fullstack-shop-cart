import express, { Request, Response, NextFunction,Router } from 'express';
import Product from '../models/Product';
import Rating from '../models/Rating';
import calculateAverageRating from '../function/calculateAverageRating';
import calculateRatingCounts from '../function/calculateRatingCounts';
import separateDecimal from '../function/separateDecimal';
import { Document, Model, Query } from 'mongoose';

const router = Router();

router.get('/page/:page', (req: Request, res: Response, next: NextFunction) => {
    try {
        const perPage: number = parseInt(req.query.perPage as string)
        const sortBy : number = parseInt(req.query.sortBy as string) ? parseInt(req.query.sortBy as string) : 0
        const page : number = req.params.page ? parseInt(req.params.page) : 1
        const listTypeQueryParam = req.query.listType as string;
        const listType = listTypeQueryParam && listTypeQueryParam.trim() !== '' ? JSON.parse(listTypeQueryParam) : [];
        const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : 0
        const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : 0

        Product.exists({}).then((pd) => {
            if (pd) {
                Product.find({}).then(async (product) => {
                    const infoProduct: any[] = [];
                    const typeList: any[] = [];    
                    product.forEach((c) => {
                        const index: number = typeList.findIndex((e) => e.type === c.category);

                        if (index === -1) {
                        typeList.push({
                            type: c.category,
                            number: 1,
                        });
                        } else {
                        typeList[index].number++;
                        }
                    });
                    if(listType.length)
                    {
                        Product.collection.createIndex({ price: 1 });
                        
                        let query: any = { category: { $in: listType } };

                        if (minPrice > 0) {
                            query.price = { $gt: minPrice };
                        }

                        if (maxPrice > 0) {
                            query.price = { ...query.price, $lt: maxPrice };
                        }

                        try {
                            const [products, count] = await Promise.all([
                                Product.find(query)
                                    .sort(sortBy === 0 ? { date: -1, _id: -1 } : { totalSold: -1, _id: -1 })
                                    .limit(perPage)
                                    .skip(perPage * (page - 1))
                                    .lean(), // Sử dụng lean()
                                Product.countDocuments(query)
                            ]);

                            // Xử lý dữ liệu và trả về kết quả
                            const infoProduct = [];
                            for (const c of products) {
                                const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                                const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();
                                const convertedTotalRating = totalRating.map(item => ({
                                    rating: item.rating.toString(),
                                    count: item.count,
                                }));
                                const averageRating = calculateAverageRating(convertedTotalRating).toFixed(1);
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
                                    count: rt ? rt.listReview.length : 0,
                                    averageRating,
                                    integerPart,
                                    decimalPart,
                                });
                            }

                            let totalPages = [];
                            const pageTotal = Math.ceil(count / perPage);
                            const currentpage = page;
                            const prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            const nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;
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
                                infoProduct,
                                setTypeList: typeList,
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                perPage,
                                sortBy,
                            });
                        } catch (error) {
                            console.log(error);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }
                    }
                    else
                    {
                        Product.collection.createIndex({ price: 1 });

                        let query: any = {};

                        if (minPrice > 0) {
                            query.price = { $gt: minPrice };
                        }

                        if (maxPrice > 0) {
                            query.price = { ...query.price, $lt: maxPrice };
                        }

                        try {
                            const [products, count] = await Promise.all([
                                Product.find(query)
                                    .sort(sortBy === 0 ? { date: -1, _id: -1 } : { totalSold: -1, _id: -1 })
                                    .limit(perPage)
                                    .skip(perPage * (page - 1))
                                    .lean(), // Sử dụng lean()
                                Product.countDocuments(query)
                            ]);

                            // Xử lý dữ liệu và trả về kết quả
                            const infoProduct = [];
                            for (const c of products) {
                                const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                                const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();
                                const convertedTotalRating = totalRating.map(item => ({
                                    rating: item.rating.toString(),
                                    count: item.count,
                                }));
                                const averageRating = calculateAverageRating(convertedTotalRating).toFixed(1);
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
                                    count: rt ? rt.listReview.length : 0,
                                    averageRating,
                                    integerPart,
                                    decimalPart,
                                });
                            }

                            let totalPages = [];
                            const pageTotal = Math.ceil(count / perPage);
                            const currentpage = page;
                            const prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            const nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;
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
                                infoProduct,
                                setTypeList: typeList,
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                perPage,
                                sortBy,
                            });
                        } catch (error) {
                            console.log(error);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }
                    }
                });
            } else {
                return res.status(200).json({})
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/page/:page', function(req: Request, res: Response, next: Function) {
    const body = req.body;
    const listProduct: any[] = [];
    let perPage: number = parseInt(body.perPage);

    let sortBy = parseInt(body.sortBy)
    const page : number = parseInt(req.params.page) ? parseInt(req.params.page) : 1
    
    if (body.listType?.length) {
        if (sortBy === 1) {
            if (body.minPrice > 0 && body.maxPrice > 0) {
                Product.find({ category: { $in: body.listType }, price: { $gt: body.minPrice, $lt: body.maxPrice } })
                .sort({ totalSold: -1, _id:-1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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

                    Product.count({
                        category: { $in: body.listType },
                        price: { $gt: body.minPrice, $lt: body.maxPrice },
                    }).exec().then((count) => {
                        if (count) {
                            let totalPages: any[] = [];
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page

                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;

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
                            res.status(200).send({
                                code: '1',
                                sizeList : count,
                                listProduct: listProduct,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        }
                        else {
                            res.status(200).send({ code: '2', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            else if (body.maxPrice > 0) {
                Product.find({ category: { $in: body.listType }, price: { $lt: body.maxPrice } })
                .sort({ totalSold: -1, _id:-1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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

                    Product.count({
                        category: { $in: body.listType },
                        price: { $gt: body.minPrice, $lt: body.maxPrice },
                    }).exec().then((count) => {
                        if (count) {
                            let totalPages: any[] = [];
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page

                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;

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
                            res.status(200).send({
                                code: '3',
                                sizeList : count,
                                listProduct: listProduct,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        }
                        else {
                            res.status(200).send({ code: '4', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            else 
            {
                Product.find({ category: { $in: body.listType } })
                .sort({ totalSold: -1, _id: -1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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
    
                    Product.count({ category: { $in: body.listType } }).exec().then((count) => {
                        if (count) {
                            let totalPages: any[] = [];
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page;
    
                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;
    
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
                            res.status(200).send({
                                code: '5',
                                listProduct: listProduct,
                                sizeList : count,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        } else {
                            res.status(200).send({ code: '6', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
        else {
            if (body.minPrice > 0 && body.maxPrice > 0) {
                Product.find({ category: { $in: body.listType }, price: { $gt: body.minPrice, $lt: body.maxPrice } })
                .sort({ date: -1, _id:-1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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
                    Product.count({
                        category: { $in: body.listType },
                        price: { $gt: body.minPrice, $lt: body.maxPrice },
                    }).exec().then((count) => {
                        if (count) {
                            let totalPages: any[] = [];
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page

                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;

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
                            res.status(200).send({
                                code: '7',
                                sizeList : count,
                                listProduct: listProduct,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        }
                        else {
                            res.status(200).send({ code: '8', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            else if (body.maxPrice > 0) {
                Product.find({ category: { $in: body.listType }, price: { $lt: body.maxPrice } })
                .sort({ date: -1, _id:-1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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

                    Product.count({
                        category: { $in: body.listType },
                        price: { $gt: body.minPrice, $lt: body.maxPrice },
                    }).exec().then((count) => {
                        if (count) {
                            let totalPages: any[] = [];
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page

                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;

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
                            res.status(200).send({
                                code: '9',
                                sizeList : count,
                                listProduct: listProduct,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        }
                        else {
                            res.status(200).send({ code: '10', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            else 
            {
                Product.find({ category: { $in: body.listType } })
                .sort({ date: -1, _id: -1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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
    
                    Product.count({ category: { $in: body.listType } }).exec().then((count) => {
                        if (count) {
                            let totalPages: any[] = [];
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page;
    
                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;
    
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
                            res.status(200).send({
                                code: '11',
                                sizeList : count,
                                listProduct: listProduct,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        } else {
                            res.status(200).send({ code: '12', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
    }
    else
    {
        if (sortBy === 1) {
            if (body.minPrice > 0 && body.maxPrice > 0) {
                Product.find({price: { $gt: body.minPrice, $lt: body.maxPrice } })
                .sort({ totalSold: -1, _id:-1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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

                    Product.count({
                        price: { $gt: body.minPrice, $lt: body.maxPrice },
                    }).exec().then((count) => {
                        if (count) {
                            let totalPages: any[] = [];
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page

                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;

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
                            res.status(200).send({
                                code: '13',
                                sizeList : count,
                                listProduct: listProduct,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        }
                        else {
                            res.status(200).send({ code: '14', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            else if (body.maxPrice > 0) {
                Product.find({price: { $lt: body.maxPrice } })
                .sort({ totalSold: -1, _id:-1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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

                    Product.count({
                        price: { $gt: body.minPrice, $lt: body.maxPrice },
                    }).exec().then((count) => {
                        if (count) {
                            let totalPages: any[] = [];
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page

                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;

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
                            res.status(200).send({
                                code: '15',
                                sizeList : count,
                                listProduct: listProduct,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        }
                        else {
                            res.status(200).send({ code: '16', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            else
            {
                Product.find({})
                .sort({ totalSold: -1, _id: -1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page;
    
                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;
    
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
                            res.status(200).send({
                                code: '17',
                                sizeList : count,
                                listProduct: listProduct,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        } else {
                            res.status(200).send({ code: '18', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }        
        else {
            if (body.minPrice > 0 && body.maxPrice > 0) {
                Product.find({price: { $gt: body.minPrice, $lt: body.maxPrice } })
                .sort({ date: -1, _id:-1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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

                    Product.count({
                        price: { $gt: body.minPrice, $lt: body.maxPrice },
                    }).exec().then((count) => {
                        if (count) {
                            let totalPages: any[] = [];
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page

                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;

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
                            res.status(200).send({
                                code: '19',
                                sizeList : count,
                                listProduct: listProduct,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        }
                        else {
                            res.status(200).send({ code: '20', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            else if (body.maxPrice > 0) {
                Product.find({price: { $lt: body.maxPrice } })
                .sort({ date: -1, _id:-1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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

                    Product.count({
                        price: { $gt: body.minPrice, $lt: body.maxPrice },
                    }).exec().then((count) => {
                        if (count) {
                            let totalPages: any[] = [];
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page

                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;

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
                            res.status(200).send({
                                code: '21',
                                sizeList : count,
                                listProduct: listProduct,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        }
                        else {
                            res.status(200).send({ code: '22', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            else
            {
                Product.find({})
                .sort({ date: -1, _id: -1 })
                .clone()
                .limit(perPage)
                .skip(perPage * (page - 1))
                .then(async (product) => {
                    for (const c of product) {
                        const rt = await Rating.findOne({ productName: { $regex: `^${c.name}$`, $options: 'i' } }, { listReview: 1 });
                        const totalRating = calculateRatingCounts(rt?.listReview ?? []).reverse();             
                        const convertedTotalRating: { rating: string; count: number }[] = totalRating.map(item => ({
                            rating: item.rating.toString(),
                            count: item.count,
                        }));
                        const averageRating: string = (calculateAverageRating(convertedTotalRating).toFixed(1));
                        const [integerPart, decimalPart] = separateDecimal(parseFloat(averageRating));
                        
                        listProduct.push({
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
                            let pageTotal = Math.ceil(count / perPage);
                            let currentpage = page;
    
                            let prevPage = currentpage <= 1 ? 1 : currentpage - 1;
                            let nextPage = currentpage >= pageTotal ? pageTotal : currentpage + 1;
    
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
                            res.status(200).send({
                                code: '23',
                                sizeList : count,
                                listProduct: listProduct,
                                message: 'list,price,checkbox',
                                currentpage,
                                totalPages,
                                prevPage,
                                nextPage,
                                prevP,
                                nextP,
                                pageTotal,
                                sortBy: sortBy,
                                perPage: perPage,
                            });
                        } else {
                            res.status(200).send({ code: '24', listProduct: listProduct });
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
    }
    // return res.redirect('/store')
})


module.exports = router