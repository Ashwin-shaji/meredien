require('dotenv').config();

const sessionSecret = "mysitesessionsecret";

const emailUser = process.env.EMAIL_ID
const emailPassword = process.env.PASSWORD

module.exports = {
    sessionSecret,
    emailUser,
    emailPassword,
}