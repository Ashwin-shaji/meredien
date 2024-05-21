require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./util/authentication'); 
const path = require('path');

const app = express();

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', './views');

// Database 


mongoose.connect("mongodb://127.0.0.1:27017/meredien", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the database');
}).catch((error) => {
    console.error('Database connection error:', error);
});

// Session configuration
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        maxAge: 60000 
    }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.set('views', path.join(__dirname, 'views','users'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use("/admin", express.static(path.join(__dirname, "public")));




// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User routes
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

// Admin routes
const adminRoute = require('./routes/adminRout');
app.use('/admin', adminRoute);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
