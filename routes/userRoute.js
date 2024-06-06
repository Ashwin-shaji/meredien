const express = require('express');
const passport = require('passport');
const userController = require("../controllers/userController");
const cartController = require('../controllers/cartController');

const user_route = express.Router();

const bodyparser = require('body-parser');
user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({ extended: true }));

user_route.use(express.static('public'));

const auth=require('../middlewares/userAuth');

// Login Routes
user_route.get('/',auth.isLogout,userController.loadlogin);
user_route.post('/', userController.verifyLogin);

// Registration Routes
user_route.get('/register',auth.isLogout, userController.loadRegister);
user_route.post('/register', userController.insertUser);

// OTP Routes
user_route.get('/otp', auth.isLogout,userController.loadotp);
user_route.post('/otp',userController.verifyOtp);
user_route.post('/otp', userController.resentotp);

user_route.get('/logout', userController.logout);

user_route.get('/home',auth.isLogin,userController.loadHome);


user_route.get('/productdetail',auth.isLogin,userController.loadProduct);


user_route.get('/userprofile',auth.isLogin,userController.loadUserProfile);
user_route.post('/userprofile',auth.isLogin,userController.EditProfile);

user_route.post('/addaddress',auth.isLogin,userController.Addaddress);

user_route.get('/editaddress',auth.isLogin,userController.editAddress);





user_route.get('/cart',auth.isLogin,cartController.loadCart);


user_route.get('/shop',auth.isLogin,userController.loadShop);
user_route.post('/search', userController.search);
user_route.post('/sort',userController.sort);
user_route.post('/cat_fil',userController.catfil)





user_route.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

user_route.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/home'); 
    }
);

module.exports = user_route;
