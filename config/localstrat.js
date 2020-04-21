const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../mongodb/User');
const config = require('config');
const FACEBOOK_APP_ID = config.get('FACEBOOK_APP_ID');
const FACEBOOK_APP_SECRET = config.get('FACEBOOK_APP_SECRET');

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


    passport.use(new FacebookStrategy({
        clientID : 517815898888112,
        clientSecret : '87f8ee3929e2926828820dc26da91e96',
        callbackURL : 'https://node-pug-auth.herokuapp.com/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name'] 
    } , (accessToken , refreshToken , profile , done) => {
        console.log(accessToken);
        console.log(profile);
        User.findOne({fbId : profile.id})
        .then(user => {
            if(!user){
                const newUser = new User({
                    name : profile.name.givenName + " " + profile.name.middleName + " " + profile.name.familyName,
                    email : profile.emails[0].value,
                    fbId : profile.id,
                    fbToken : accessToken
                });

                newUser.save()
                .then(x => done(null , x))
                .catch(err => {if(err) throw err})

            }else{
                done(null , user)
            }
        })
        .catch(err => done(err))
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