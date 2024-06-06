const Admin=require('../models/adminModel');
const mongoose=require('mongoose')
const User = require('../models/userModel');

const bcrypt = require('bcrypt');


const loadLogin=async(req,res)=>{
    try {
        res.render('adminLogin',{error:null})
    } catch (error) {
        console.log(error.message);
    }
}


const loadLogout = async(req,res)=>{
    try{
     //   req.session.user_id =false;
     req.session.destroy()
        res.redirect('/admin/login')
    } catch(error){
        console.log(error.message);
    }
  };



const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email, password);
        const adminData = await Admin.findOne({email:email })
   
        if (adminData) {           
            if (adminData.password===password) {
                req.session.adminId = adminData._id
               console.log( req.session.adminId);
                res.redirect('/admin/dashboard');
            } else { 
                res.render('adminLogin', { message: 'Password is not matching' });
            }
        } else {
            console.log("no user found");
            res.render('adminLogin', { message: 'No users found with the email. please re-enter email' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error'); 
    }
};

const loadDashboard = async (req,res)=>{
    try {
        res.render('dashboard')
    } catch (error) {
        console.log(error);
    }
}

const userlist = async(req,res)=>{
    try{
      const perPage=5;
      const page = parseInt(req.query.page) || 1;
      const totalusers= await User.countDocuments({});
      const totalPage=Math.ceil(totalusers / perPage)
      const userData = await User.find({ is_admin: false }).skip(perPage * (page - 1)).limit(perPage);

       console.log(userData);
        res.render('users', { users: userData, page, totalPage });

    }catch(error){
        console.log(error.message);
    }
}


const blockUser = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById(id);

        if(userData){ 
            userData.isBlocked = true;
            await userData.save();

            res.redirect('/admin/userlist');
        }
    } catch (error) {
        console.log(error.message);
    }
}




const unblockUser = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById(id);

        if(userData){
            userData.isBlocked = false; // Update the user's isBlocked field to false
            await userData.save();
        
            res.redirect('/admin/userlist');
        }
    } catch (error) {
        console.log(error.message);
    }
}



module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    loadLogout,
    userlist,
    blockUser,
    unblockUser
}