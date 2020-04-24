require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//connect to mongodb
mongoose.connect(process.env.MONGO_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
} , (err)=>{
    if(err){
        console.log(err);
    }
    console.log("connected to auth database")
})

//passport func
require('./config/localstrat')(passport);

//set view engine to pug
app.set("view engine" , "pug");

//session
app.use(session({
    secret : "secret",
    resave : true,
    saveUninitialized : true
}))

//passport
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());
app.use((req , res , next)=>{
    res.locals.succ_msg = req.flash('succ_msg');
    res.locals.err_msg = req.flash('err_msg');
    res.locals.errors = req.flash('errors');
    res.locals.error = req.flash('error');
    next();
})

//helmet protection
app.use(helmet());

//body parser
app.use(express.json());
app.use(express.urlencoded({extended : false}));


//routes
app.use('/' , require('./routes/index'));
app.use('/user' , require('./routes/users'));

app.get('/auth/facebook' , passport.authenticate('facebook' , {scope : ['email']}));

app.get('/auth/facebook/callback' , passport.authenticate('facebook' , {
    successRedirect : '/dashboard',
    failureRedirect : '/user/login'
}))

//set static file
app.use(express.static(path.join(__dirname , "public")))

//listen to port
const PORT = process.env.PORT || 5000;
app.listen(PORT , ()=>console.log(`APP IS RUNNING ON PORT : ${PORT}`))