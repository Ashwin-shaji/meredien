const express = require('express');
const passport = require('passport');
const userController = require("../controllers/userController");
const cartController = require('../controllers/cartController');

const user_route = express.Router();

const bodyparser = require('body-parser');
user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({ extended: true }));

user_route.use(express.static('public'));

// Login Routes
user_route.get('/', userController.loadlogin);
user_route.post('/', userController.verifyLogin);

// Registration Routes
user_route.get('/register', userController.loadRegister);
user_route.post('/register', userController.insertUser);

// OTP Routes
user_route.get('/otp', userController.loadotp);
user_route.post('/otp', userController.verifyOtp);
user_route.post('/otp', userController.resentotp);

user_route.get('/logout', userController.logout);


user_route.get('/home', userController.loadHome);


user_route.get('/productdetail', userController.loadProduct);


user_route.get('/userprofile', userController.loadUserProfile);
user_route.post('/userprofile', userController.EditProfile);

user_route.post('/addaddress',userController.Addaddress);

user_route.get('/editaddress',userController.editAddress);





user_route.get('/cart', cartController.loadCart);


user_route.get('/shop', userController.loadShop);
user_route.post('/search', userController.search);








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
