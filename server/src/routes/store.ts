import express, { Request, Response, NextFunction,Router } from 'express';
import Product from '../models/Product';
import Rating from '../models/Rating';
import calculateAverageRating from '../function/calculateAverageRating';
import calculateRatingCounts from '../function/calculateRatingCounts';
import separateDecimal from '../function/separateDecimal';


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
                Product.find({}).then((product) => {
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
                        if (sortBy === 0) {
                            if (minPrice > 0 && maxPrice > 0)
                            {
                                Product.find({category: { $in: listType }, price: { $gt: minPrice, $lt: maxPrice } })
                                .sort({ date: -1, _id: -1 })
                                .clone()
                                .limit(perPage)
                                .skip(perPage * (page - 1))
                                .then(async (product) => {
                                    if (product.length) {
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
        
                                        Product.count({category: { $in: listType }, price: { $gt: minPrice, $lt: maxPrice } }).exec().then((count) => {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                            else if (maxPrice > 0)
                            {
                                Product.find({category: { $in: listType },price: {$lt: maxPrice }})
                                .sort({ date: -1, _id: -1 })
                                .clone()
                                .limit(perPage)
                                .skip(perPage * (page - 1))
                                .then(async (product) => {
                                    if (product.length) {
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
        
                                        Product.count({category: { $in: listType },price: {$lt: maxPrice }}).exec().then((count) => {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                            else
                            {
                                Product.find({category: { $in: listType }})
                                .sort({ date: -1, _id: -1 })
                                .clone()
                                .limit(perPage)
                                .skip(perPage * (page - 1))
                                .then(async (product) => {
                                    if (product.length) {
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
        
                                        Product.count({category: { $in: listType }}).exec().then((count) => {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                        } 
                        else {
                            if (minPrice > 0 && maxPrice > 0)
                            {
                                Product.find({category: { $in: listType }, price: { $gt: minPrice, $lt: maxPrice } })
                                .sort({ totalSold: -1, _id: -1 })
                                .clone()
                                .limit(perPage)
                                .skip(perPage * (page - 1))
                                .then(async (product) => {
                                    if (product.length) {
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
        
                                        Product.count({category: { $in: listType }, price: { $gt: minPrice, $lt: maxPrice } }).exec().then((count) => {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                            else if (maxPrice > 0)
                            {
                                Product.find({category: { $in: listType },price: { $lt: maxPrice }})
                                .sort({ totalSold: -1, _id: -1 })
                                .clone()
                                .limit(perPage)
                                .skip(perPage * (page - 1))
                                .then(async (product) => {
                                    if (product.length) {
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
        
                                        Product.count({category: { $in: listType },price: {$lt: maxPrice }}).exec().then((count) => {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                            else
                            {
                                Product.find({category: { $in: listType }})
                                .sort({ totalSold: -1, _id: -1 })
                                .clone()
                                .limit(perPage)
                                .skip(perPage * (page - 1))
                                .then(async (product) => {
                                    if (product.length) {
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
        
                                        Product.count({category: { $in: listType }}).exec().then((count) => {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                        }
                    }
                    else
                    {
                        if (sortBy === 0) {
                            if (minPrice > 0 && maxPrice > 0)
                            {
                                Product.find({price: { $gt: minPrice, $lt: maxPrice } })
                                .sort({ date: -1, _id: -1 })
                                .clone()
                                .limit(perPage)
                                .skip(perPage * (page - 1))
                                .then(async (product) => {
                                    if (product.length) {
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
        
                                        Product.count({price: { $gt: minPrice, $lt: maxPrice } }).exec().then((count) => {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                            else if (maxPrice > 0)
                            {
                                Product.find({price: {$lt: maxPrice }})
                                .sort({ date: -1, _id: -1 })
                                .clone()
                                .limit(perPage)
                                .skip(perPage * (page - 1))
                                .then(async (product) => {
                                    if (product.length) {
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
        
                                        Product.count({price: {$lt: maxPrice }}).exec().then((count) => {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
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
                                    if (product.length) {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                        } 
                        else {
                            if (minPrice > 0 && maxPrice > 0)
                            {
                                Product.find({price: { $gt: minPrice, $lt: maxPrice } })
                                .sort({ totalSold: -1, _id: -1 })
                                .clone()
                                .limit(perPage)
                                .skip(perPage * (page - 1))
                                .then(async (product) => {
                                    if (product.length) {
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
        
                                        Product.count({price: { $gt: minPrice, $lt: maxPrice } }).exec().then((count) => {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                            else if (maxPrice > 0)
                            {
                                Product.find({price: { $lt: maxPrice }})
                                .sort({ totalSold: -1, _id: -1 })
                                .clone()
                                .limit(perPage)
                                .skip(perPage * (page - 1))
                                .then(async (product) => {
                                    if (product.length) {
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
        
                                        Product.count({price: {$lt: maxPrice }}).exec().then((count) => {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
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
                                    if (product.length) {
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
                                            }
                                        });
                                    } 
                                    else {
                                        return res.status(200).json({})
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
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