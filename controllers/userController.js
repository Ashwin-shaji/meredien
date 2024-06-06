const User=require('../models/userModel');
const mongoose = require('mongoose')
const session = require('express-session')
const bcrypt=require('bcrypt')
const productModel=require('../models/productModel')


const generateOTP=require('../util/otpgenerator');
const { sendInsertOtp } = require('../util/insertotp');
const userModel=require('../models/userModel');
const addressModel = require('../models/addressModel');




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
        const user=await userModel.findById(req.session.user)
        
        res.render('account',{user})
    } catch (error) {
        console.log(error.message);
    }
}

const EditProfile=async(req,res)=>{
try{
const {name,mobile}=req.body
const user=await userModel.findByIdAndUpdate(req.session.user,{name:name,mobile:mobile})
res.redirect('/userprofile')

}
catch(err){
   console.log(err.message); 
}
}


  

const Addaddress = async (req, res) => {
    try {
        const { addressType, name, city, state, landMark, mobile, alt, Address, pincode } = req.body;

        console.log(req.body);

     
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(pincode)) {
            return res.status(400).send({ message: 'Invalid pincode format' });
        }

      
        const newAddress = { addressType, name, city, state, landMark, mobile, alt, Address, pincode };
        console.log(newAddress);

        const existingAddresses = await addressModel.findOne({ userId: req.session.user });
        console.log('Existing addresses:', existingAddresses);



        
if(mobile === alt){
     // req.flash('error','phone and alternate phone must be different.');
     return res.redirect('/userprofile')
}
        if (existingAddresses) {
            // Ensure address array is initialized
            if (!existingAddresses.address) {
                existingAddresses.address = [];
            }

            // Add the new address to the existing address array
            existingAddresses.address.push(newAddress);
            await existingAddresses.save();
        } else {
            // Create a new address record if none exists
            console.log('Creating a new address record');
            const address = new addressModel({
                userId: req.session.user,
                address: [newAddress]
            });
            await address.save();
        }

        console.log('Address added successfully');
        res.redirect('/userprofile');

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};


const editAddress=async (req,res)=>{
    try {
        res.render('/editAddress')
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send({ message: 'Server error', error: error.message });
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

const search = async (req, res) => {
    try {
        const product = await productModel.findOne({ name: req.body.productName });
        console.log(product);
        if (product) {
            res.status(200).json({ product });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const sort = async (req, res) => {
    try {
        const sortBy = req.body.sort;
        let sortQuery;

        switch (sortBy) {
            case 'aA - zZ':
                sortQuery = { name: 1 };
                break;
            case 'zz-aa':
                sortQuery = { name: -1 };
                break;
            case 'low-to-high':
                sortQuery = { price: 1 };
                break;
            case 'high-to-low':
                sortQuery = { price: -1 };
                break;
            case 'release-date':
                sortQuery = { releaseDate: -1 };
                break;
            case 'avg-rating':
                sortQuery = { avgRating: -1 };
                break;
            case 'featured':
            default:
                sortQuery = {};  // No specific sort, default or featured sort logic
                break;
        }

        // Assuming you have a Product model and you are sorting products
        const product= await productModel.find().sort(sortQuery);
        console.log(product);
        res.status(200).json({product});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'An error occurred while sorting products.' });
    }
};

const catfil=async(req,res)=>{
    try {
        const product = await productModel.findMany({ name: req.body.category });
        console.log(product);
        if (product) {
            res.status(200).json({ product });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
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
    EditProfile,
   // loadhome,
    verifyOtp,
    loadHome,
    verifyLogin,
    logout,
    loadProduct,
    resentotp,
    loadUserProfile,
    loadShop,
    Addaddress,
    editAddress,
    search,
    sort,
    catfil
}