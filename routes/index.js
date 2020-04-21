const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/ensureAuth');

router.get('/' , (req , res)=>{
    res.render('index.pug')
});

router.get('/dashboard' , ensureAuthenticated ,(req , res)=>{
    console.log(req.user)
    res.render('dashboard.pug' , {userName : req.user.name});
})

module.exports = router;