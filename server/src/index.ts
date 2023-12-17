import express, { Request, Response } from 'express'
import createError from 'http-errors';
import { engine } from 'express-handlebars';
import flash from 'express-flash';
import session from 'cookie-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import passport from 'passport';
import cors from 'cors'

const app = express();

const reduceOp = function (args: IArguments, reducer: (a: any, b: any) => any) {
    const argsArray = Array.from(args);
    argsArray.pop(); // => options
    const first = argsArray.shift();
    return argsArray.reduce(reducer, first);
};

const sessionConfig = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // if set to true tests won't work
    maxAge: 10 * 60 * 1000 * 100000,
    sameSite: 'none',
  },
};

const corsOptions = {
  origin: 'https://shop-cart-vercel.vercel.app/', // Thay thế bằng địa chỉ ứng dụng frontend của bạn
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser('ShopCart'));
app.use(cors(corsOptions));

app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb: any) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb: any) => {
      cb();
    };
  }
  if (request.session && !request.session.destroy) {
    request.session.destroy = (cb: any) => {
      request.session = null;
    };
  }
  next();
});

passport.serializeUser(function (user: any, cb: any) {
  cb(null, user);
});
passport.deserializeUser(function (obj: any, cb: any) {
  return cb(null, obj);
});

// db
const db = require('./db');

const indexRouter = require('./routes/home');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const adminRouter = require('./routes/admin');
const storeRouter = require('./routes/store');
const facebookRouter = require('./middleware/auth/facebook-auth');
const searchRouter = require('./routes/search');


app.get('/', (req: Request, res: Response) => {
	return res.send('Welcome to my API')
})
app.use('/api/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/admin', adminRouter);
app.use('/api/store', storeRouter);
app.use('/api/auth/facebook', facebookRouter);
app.use('/api/search', searchRouter);

app.listen(5000, () => {
  console.log(`Listening at http://localhost:5000`);
});
