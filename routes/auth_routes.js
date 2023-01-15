const router = require("express").Router()
const UserModel = require("../models/user_model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../configs")

router.post('/signup', (req, res) =>{
    const {fullname, email, password} = req.body;
    if(!fullname || !email || !password){
        return res.status(400).json({error: "One or more field left empty"});
    }

    UserModel.findOne({email: email}).then((user)=>{
        if(user){
            return res.status(401).json({error: "Already registered email"})
        }
        bcrypt.hash(password, 10)
        .then(hashedPassword =>{
            const dbUser = new UserModel({fullname: fullname, email: email, password: hashedPassword})
            dbUser.save()
            .then(user =>{
                res.status(201).json({success: "Registration successful"})
            }).catch(error => console.log(error))

        }).catch(error => console.log(error))

    }).catch(error => console.log(error))
})

router.post('/login', (req, res) =>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({error: "One or more field left empty"});
    }

    UserModel.findOne({email: email}).then((user)=>{
        if(!user){
            return res.status(401).json({error: "Account not found"})
        }
        bcrypt.compare(password, user.password)
        .then(match =>{
            if(match){
                const jwtToken = jwt.sign({_id: user._id, email: user.email}, JWT_SECRET)
                user.password = undefined
                return res.status(200).json({user: user, token: jwtToken})
            }else{
                return res.status(400).json({error:"Account not found"})
            }
        })
        
    }).catch(error => console.log(error))
})


module.exports = router