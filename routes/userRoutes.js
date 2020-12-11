const express = require('express');
const MongoUtil = require('../MongoUtil')
const ObjectId  = require('mongodb').ObjectId;
const UserModel = require('../models/UserModel')
const passport = require('../passport/setup');
const router =express.Router();


let db= MongoUtil.getDB();

router.get('/register', async (req,res) => {
    res.render('users/user_form')
})

router.post('/register',async (req,res)=> {
    await UserModel.createUser(req.body.username,req.body.email,req.body.password);
    res.redirect('/')
})


router.get('/login', async (req,res)=> {
    res.render('users/login_form')
})

router.post('/login', async(req,res,next) => {
   
    let authProcess = passport.authenticate('local', async function(err,user,info){
    if(err) {
        res.send("Error loggin in")
    }
    if(!user){
        res.send("User not found")
    }

    let loginError = req.logIn(user, (loginError) => {
        if (loginError){
            console.log(loginError);
            res.send("Error loggin in")
        } else
        {
            res.send("User has logged in sucessfully")
        }
    })
});

   authProcess(req,res,next);
})

module.exports = router;