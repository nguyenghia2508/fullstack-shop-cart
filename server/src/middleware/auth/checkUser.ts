import { Request, Response, NextFunction } from 'express';

const checkUser = (url: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.session?.user;
        if (url === 0) {
            if (user) {
                res.redirect('/');
            } else {
                next();
            }
        } else {
            if (!user) {
                res.redirect('/user/login');
            } else {
                next();
            }
        }
    };
};

export default checkUser;
