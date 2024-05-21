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

// Home Route
user_route.get('/home', userController.loadHome);

// Product Detail Route
user_route.get('/productdetail', userController.loadProduct);

// User Profile Route
user_route.get('/userprofile', userController.loadUserProfile);

// Cart Route
user_route.get('/cart', cartController.loadCart);

// Shop Route
user_route.get('/shop', userController.loadShop);

// Google Authentication Routes
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
