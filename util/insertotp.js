const nodemailer=require('nodemailer');
const config=require("../config/config");
const { model } = require('mongoose');

//create a transport object using smtp transport 

const transporte=nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:config.emailUser,
        pass:config.emailPassword
    },
    tls:{
        rejectUnauthorized:false //accept self-signed certificates
    }
});

//send otp email for forget password
const sendInsertOtp = async (email, otp) => {
    console.log(email, otp, "is send otp");
    const mailOptions = {
        from: '"MEREDIEN" <meredien@gmail.com>',
        to: email,
        subject: 'Your OTP from Meredien',
        text: `Hi, Your OTP is ${otp}`
    };

    try {
        const info = await transporte.sendMail(mailOptions);
        console.log("email send successfully: ", info.response);
        console.log(otp);
        return otp;
    } catch (error) {
        console.error('error sending otp :', error);
        throw new Error('failed to send otp');
    }
};

module.exports = { sendInsertOtp };
