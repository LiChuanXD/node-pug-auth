const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../mongodb/User');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField : "email"} , (email , password , done)=>{
        User.findOne({email}).then(x=>{
            if(!x){
                return done(null , false , {message : "Email is not registered"})
            }else{
                bcrypt.compare(password , x.password , (err , result)=>{
                    if(err) throw err;
                    if(result){
                        return done(null , x)
                    }else{
                        return done(null , false , {message : "Wrong password"})
                    }
                })
            }
        }).catch(err=>console.log(err))
    }));

    passport.serializeUser((user , done)=>{
        done(null , user.id)
    });

    passport.deserializeUser((id , done)=>{
        User.findById(id , (err , x)=>{
            done(err , x)
        });
    });
};