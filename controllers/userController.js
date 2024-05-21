const User=require('../models/userModel');
const mongoose = require('mongoose')
const session = require('express-session')
const bcrypt=require('bcrypt')
const productModel=require('../models/productModel')


const generateOTP=require('../util/otpgenerator');
const { sendInsertOtp } = require('../util/insertotp');
const userModel=require('../models/userModel')




const securePassword = async(password)=>{

    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch(error){
        console.log(error.message);
    }
}


const loadlogin=async(req,res)=>{
    try{
        res.render('login',{error:null})
    }catch{
        console.log(error.message);
    }
}

const logout=async(req,res)=>{
    try{
req.session.user=false;
res.redirect('/');
    }
    catch(error){
        console.log('logout',error.message);
    }

}

//home
const loadHome=async(req,res)=>{
    try {
        const product=await productModel.find({is_deleted:true})
        res.render('home',{error:null,product})
    } catch (error) {
        console.log(error);
    }
}



const loadRegister=async(req,res,next)=>{
    try{
        res.render('registration',{errors:null});
    }catch(error){
       next(error)
    }
}

//registration

const insertUser=async(req,res)=>{
    try{
        const {name,email,mobile,password,confirmpassword}=req.body;
        if(password===confirmpassword){
            const otp = generateOTP.generateOTP();
            console.log(otp);
            const data={name,email,mobile,password,confirmpassword,otp};
            req.session.Data=data;
            console.log(data)

            //  Send OTP to user's email
            const sentEmailUser = await sendInsertOtp(email, otp);
            console.log(sentEmailUser,"emailsent");
            if (sentEmailUser) {
             
                // Redirect to OTP verification page
                return res.redirect('/otp');
            }
        } else {
            console.log("else worked in email sent");
            // If passwords don't match, render the register page with an error message
            return res.render('registration', { error: 'Passwords do not match.' });
        }
        
    }catch(error){
        console.log(error.message);
    }
}


//home

// const loadhome=async(req,res)=>{
//     try {
//         res.render('home')
//     } catch (error) {
//         console.log(error.message);   
//     }
// }

const resentotp=async(req,res)=>{
    try {
        const otp = generateOTP.generateOTP();
    } catch (error) {
        console.log(error);
    }
}

const loadotp=async(req,res)=>{
    try{
        res.render('otp',{errors:null})
        console.log("inside otp");
    }catch(error){
        console.log(error.message);
    }
}



const verifyOtp=async(req,res)=>{
    try {
        console.log('before otp verification');
       const{otp}=req.body
        if(otp===req.session.Data.otp){
            const userData = await req.session.Data
            const user = new User(userData)

            await user.save()
            res.redirect('/home')
        }else{
            return res.render('otp',{error:'otp not correct'})
        }
    } catch (error) {
        console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const data = { email, password, }

        const userData = await User.findOne({ email: email })

        if (userData) {
            if (data.password === userData.password) {
                req.session.user=userData._id
                res.redirect('/home',)
            } else {
                res.render('login', { message: 'Password is not matching' })
            }

        } else {
            console.log("no user found ")
            res.render('login', { message: 'No users found with the email. please re-enter email' })

        }
    } catch (error) {
        console.log(error.message)
        
    }
}


const loadProduct=async(req,res)=>{
    try {
        const id=req.query.id;
        const product=await productModel.findById(id);
        console.log(product);
        res.render('productPage',{product})
    } catch (error) {
        console.log(error.message);
    }
}

const loadUserProfile=async(req,res)=>{
    try {
        res.render('account')
    } catch (error) {
        console.log(error.message);
    }
}


const loadShop=async(req,res)=>{
    try {
        const product=await productModel.find({is_deleted:true})
        res.render('shop',{error:null,product})
    } catch (error) {
        console.log(error.message);
        }
}


module.exports={
    securePassword,
    loadRegister,
    insertUser,
    loadotp,
    loadlogin,
   // loadhome,
    verifyOtp,
    loadHome,
    verifyLogin,
    logout,
    loadProduct,
    resentotp,
    loadUserProfile,
    loadShop
}