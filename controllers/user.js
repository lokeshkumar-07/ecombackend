import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import createError from "../utils/createError.js"
import axios from "axios"
import Cart from "../models/Cart.js"

export const registerUser = async(req,res,next) => {
    
    try{
        
        const user = User.findOne({email: req.body.email})
        if(!user) return next(createError(403, 'User Already Exists!'))

        const hashPassword = bcrypt.hashSync(req.body.password, 10)

        const newUser = new User({
            ...req.body,
            password: hashPassword,
        })

        await newUser.save()

        const token = jwt.sign({id: newUser._id, role: newUser.role}, process.env.JWT_SECRET, {expiresIn: '90d'})

        res.status(201).send({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            address: newUser.address,
            token: token 
        })
    }catch(err){
        next(err)
    }
}

export const loginUser = async(req,res,next) => {
    if(req.body.googleToken){
        axios
            .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${req.body.googleToken}`
            }
        })
            .then(async response => {
                const name = response.data.given_name;
                const email = response.data.email;
                
                const existingUser = await User.findOne({email})

                if (existingUser){ 
                    const token = jwt.sign({id: existingUser._id, role: existingUser.role}, process.env.JWT_SECRET, {expiresIn: '90d'})
            
            
                    res.status(201).send({
                        _id: existingUser._id,
                        name: existingUser.name,
                        email: existingUser.email,
                        role: existingUser.role,
                        address: existingUser.address,
                        token: token 
                    })
                }
                else {
                    const user = await User.create({verified:"true",email, name})


                    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '90d'})
        
        
                    res.status(201).send({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        address: user.address,
                        token: token 
                    })
                }
                
            })
            .catch(err => {
                next(err)
            })
    }
    else{
        try{
            const user = await User.findOne({email: req.body.email})
            if (!user) return next(createError(404, 'User not found!')) 
    
            const passwordMatch = bcrypt.compareSync(req.body.password, user.password)
    
            if(!passwordMatch) return next(createError(403, 'Invalid Creadentials!'))
    
            const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '90d'})
    
    
            res.status(201).send({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                token: token 
            })
        }catch(err){
            next(err)
        }
    }
    
}

export const googleSignIn = async (req,res,next) => {
    try{
        console.log(req.body.user.email)
        const {displayName, photoURL, email} = req.body.user

        const existingUser = await User.findOne({email: email})

        if (existingUser){ 
            const token = jwt.sign({id: existingUser._id, role: existingUser.role}, process.env.JWT_SECRET, {expiresIn: '90d'})
    
    
            res.status(201).send({
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                avatar: existingUser.avatar,
                token: token 
            })
        }
        else {
            const user = await User.create({verified:"true",email, name: displayName, avatar: photoURL})


            const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '90d'})


            res.status(201).send({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                token: token 
            })
        }
    }catch(err){
        next(err)
    }
}