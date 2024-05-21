const otpgenerator=require('otp-generator');

const generateOTP = () => {
    const OTP = otpgenerator.generate(4,{
        upperCaseAlphabets:false,
        specialChars:false,
        lowerCaseAlphabets:false,
        digits:true
    });
    return OTP;
};

module.exports = {generateOTP}