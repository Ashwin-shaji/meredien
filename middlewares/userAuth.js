const isLogin = (req, res, next) => {
    try {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error in isLogin middleware:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

const isLogout = (req, res, next) => {
    try {
        if (req.session.user) {
            res.redirect('/home');
        } else {
            next();
        }
    } catch (error) {
        console.error('Error in isLogout middleware:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    isLogin,
    isLogout
};
