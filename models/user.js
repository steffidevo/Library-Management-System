const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const UserSchema = mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    user_type:{
        type:String,
        required:true
    },
    reservations:{
        type:Array
    },
    payment:{
        type:String
    }
});

const User = module.exports = mongoose.model('User',UserSchema);

module.exports.getUserById= function(id,callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername= function(username,callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser,callback){
    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            newUser.password= hash;
            newUser.save(callback);
        })
    })
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword,hash, (err, isMatch) =>{
        if(err) throw err;
        callback(null, isMatch);
    });
}

/*module.exports.updateUser = function(id,user,options,callback){
    var query = {_id:id};
    var update= {
        $set:{
        name: user.name,
        email: user.email,
        username: user.username,
        reservations:user.reservations,
        payment:user.payment
        }
    }
    User.findOneAndUpdate(query,update,options,callback)
}*/


