const express = require('express');
const router = express.Router();
const User = require('../mongodb/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//login
router.get('/login' , (req , res)=>{
    res.render('login.pug')
})

router.post('/login' , (req , res , next)=>{
    passport.authenticate('local' , {
        successRedirect : '/dashboard',
        failureRedirect : '/user/login',
        failureFlash : true
    })(req , res , next)
});

//logout
router.get('/logout' , (req , res)=>{
    req.logout();
    req.flash('succ_msg' , "You have logged out successfully");
    res.redirect('/user/login');
});


//register
router.get('/register' , (req , res)=>{
    res.render('register.pug')
})

router.post('/register' , (req , res)=>{
    const { name , email , password , cfmPassword } = req.body;

    const errors = [];

    //validations
    if(!name || !email || !password || !cfmPassword){
        errors.push({error : "Please fill in all fields"})
    }
    //check if password matches
    else if(password !== cfmPassword){
        errors.push({error : "Password do not match"})
    }
    //check if password is longer than 6 characters
    else if(password.length < 6){
        errors.push({error : "Password not long enough,"})
    }

    //after validation
    if(errors.length > 0){
        //if got error
        res.render('register' , {
            errors
        });
    }else{
        //else no error
        User.findOne({email}).then(x=>{
            if(x){
                //if existing email address
                errors.push({error : "User already exist"})
                res.render('register' , {
                    errors
                });
            }else{
                //new user
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.hash(newUser.password , 10 , (err , hash)=>{
                    if(err) throw err;
                    newUser.password = hash;

                    newUser.save().then(x=>{
                        req.flash('succ_msg' , "You have registered successfully, you may login now. :)")
                        res.redirect('/user/login')
                    }).catch(err=>console.log(err));
                });
            }
        }).catch(err=>console.log(err))
    }
})

module.exports = router;