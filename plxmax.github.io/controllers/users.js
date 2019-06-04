const jwt = require('jsonwebtoken');
const User = require('../models/user');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
function encrypt(text){ // This is used to encrypt the password with crypto
        var cipher = crypto.createCipher(algorithm,password);
        var crypted = cipher.update(text,'utf8','hex');
        crypted += cipher.final('hex');
        return crypted;
}  

exports.createUser = (req, res, next)=>{ 
    const encryptedPassword = encrypt(req.body.password);
    const user = new User({
             email: req.body.email,
             password: encryptedPassword
        });
    user.save().then(result => {
        res.status(201).json({
            message: "User Created!",
            result: result
        });
    }).catch( err => {
        res.status(500).json({            
            message: "Invalid authentication credentials!"         
        });
    });
}

exports.userLoging = (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email}).then(user=>{
        if(!user){
            return res.status(401).json({
                message: "Authentication Failed!"
            });
        }
        fetchedUser = user;
        return user.password === encrypt(req.body.password);
    }).then(result => {
        if(!result){
            return res.status(401).json({
                message: "Invalid authentication credentials!"
            });            
        }
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, "RSGJud4@%hs!ej2dksfhjsh37dfishdf", {expiresIn:'1h'});
        
        res.status(200).json({
            message: "Authentication Succussful!",
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        });
    }).catch(err=>{
        return res.status(401).json({
            message: "Authentication Failed!"
        });
    });
}

exports.getAdmin = (req, res, next)=>{ // To send the Admin Id to the front end when post-list component is initialized
    User.findOne({email: 'admin@yahoo.com'}).then(response=>{
        res.status(200).json({
        adminId: response._id
     });
    });    
}