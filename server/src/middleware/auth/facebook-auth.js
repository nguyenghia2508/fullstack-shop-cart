const User = require('../../models/User')
const passport = require('passport')
const facebookStragedy = require('passport-facebook').Strategy

const express = require('express');
const router = express.Router();
require('dotenv').config();

passport.use(
    new facebookStragedy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_SECRET_KEY,
        callbackURL: 'https://shop-cart-vercel.vercel.app/auth/facebook/callback',
        profileFields: ['id','displayName','name','gender','email']
      },
      async function (accessToken, refreshToken, profile, cb) {
        const user = await User.findOne({
          username: profile.id,
        });
        if (!user) {
          console.log('Adding new facebook user to DB..');
          const user = new User({
            fullname: profile.displayName,
            username: profile.id,
            email: profile.emails[0].value,
            password: 'Via Facebook'
          });
          await user.save().then(()=>{
            return cb(null, user);
          }).catch((err)=>{
            console.log(err) 
          })
          // console.log(user);
        } else {
          console.log('Facebook User already exist in DB..');
          // console.log(profile);
          return cb(null, user);
        }
      }
    )
);

router.get('/', passport.authenticate('facebook', { scope : ['email'] }));

router.get('/callback',passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook/error'
  }),
  function (req, res) {
    console.log(req.user)
    req.session.user = req.user.username;
    // Successful authentication, redirect to success screen.
    res.redirect('/');
  }
);

router.get('/error', (req, res) => res.send('Error logging in via Facebook..'));


// async function generateUniqueNumber() {
//     let randomNumber;
//     let isDuplicate = false;

//     do {
//         randomNumber = Math.floor(Math.random() * 1000000);

//         const existingUser = await User.findOne({ numberField: randomNumber });

//         if (!existingUser) {
//         isDuplicate = false;
//         } else {
//         isDuplicate = true;
//         }
//     } while (isDuplicate);

//     return randomNumber;
// }
  
// async function generateUniqueString() {
//     const randomNumber = await generateUniqueNumber();
//     const uniqueString = `facebookuser${randomNumber.toString().padStart(6, '0')}`;
//     return uniqueString;
// }

module.exports = router