const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
var mongojs = require('mongojs');
const User = require('../models/user');
var db = mongojs('mongodb://Steffan:S1234d1234@ds127883.mlab.com:27883/library_management_ucsc',['users']);



//Register
router.post('/register',(req, res, next)=>{
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        user_type:"student"
    });

    User.addUser(newUser,(err,user)=>{
        if(err){
           res.json({success:false,msg:"Failed to register user"}); 
        }
        else{
            res.json({success:true,msg:"User Registered"});  
        }
    })
});


//Authenticate
router.post('/authenticate',(req, res, next)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg :"User not found"});
        }

        User.comparePassword(password,user.password,(err,isMatch)=>{
            if(err) throw err;
            if(isMatch){
                //'token' - using to protect data
                const token = jwt.sign({data:user}, config.secret,{
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success:true,
                    token:'JWT '+token,
                    user:{
                        id:user._id,
                        name:user.name,
                        username:user.username,
                        email:user.email,
                        user_type:user.user_type,
                        reservation:user.reservation
                    }
                });
            }
            else{
                return res.json({success:false, msg:'Wrong password'});
            }
        });
    });
});

//Profile
router.get('/profile',passport.authenticate('jwt',{session:false}),(req, res, next)=>{
    res.json({user: req.user});
});

//Get all users
router.get('/users', function(req, res, next){
    db.users.find(function(err,users){
        if(err){
            res.send(err);
        }
        res.json(users);
    });
});

//Get a Single user
router.get('/user/:id', function(req, res, next){
    db.users.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err,user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});

//Update user
router.post('/user/:id', function(req, res, next){
    var user = {
        name: req.body.name,
        username:req.body.username,
        email: req.body.email,
        reservations:req.body.reservations,
        payment:req.body.payment
    };
    User.findByIdAndUpdate(req.params.id,{$set:user},{new:true},(err,user)=>{
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});

//Delete User
router.delete('/user/:id', function(req, res, next){
    db.users.remove({_id: mongojs.ObjectId(req.params.id)}, function(err,user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});

//Reserve a Book
router.post('/user', function(req, res, next){    
    var title = req.body[0];
    var u_id =  req.body[1];
    db.users.update({_id:mongojs.ObjectId(u_id)},{$addToSet: {reservations:title}},
    function(err,user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});

//Payment Done
router.post('/user/payment', function(req, res, next){    
    var u_id = req.body[0];
    var payment =  req.body[1];
    db.users.update({_id:mongojs.ObjectId(u_id)},{$set: {payment:payment}},
    function(err,user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});

//Reset Payment
router.post('/users/payment', function(req, res, next){    
    console.log(req.body);
    var payment =  req.body;
    db.users.update({user_type:'student'},{$set: {payment:payment}},{multi:true},
    function(err,user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});




module.exports = router;