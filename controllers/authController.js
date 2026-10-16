const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async(req,res) =>{
  try {
    const {username,email,password,role,adminKey} = req.body

    if(!username||!email||!password){
      return res.staus(400).json({message : "All fields are requreid"})
    }

  
    if(!username.trim() || !email.trim() || password.length<6){
      return res.json({message :"Enter valid Details or password must be 6 characters"})
    }

    const existUser = await User.findOne({email})

    if(existUser){
      return res.status(409).json({message:"User with this email already exist"})
    }

    const hashedPassword = await bcrypt.hash(password,5)

    const newUser = new User({...req.body,password:hashedPassword})
    await newUser.save()

    res.status(201).json({message :"Signup successfull ",data:newUser})

  } catch (error) {
     return res.status(500).json({message: "Signup failed"})
  }
}

const login = async(req,res)=>{
  try {
    const {email,password} = req.body

    if(!email || !password) {
      return res.staus(400).json({message :"Email and password are required"})
    }

    const foundUser = await User.findOne({email})

    if(!foundUser){
      return res.satus(401).json({message :"Invalid Email or password"})
    }

    const comparePassword = await bcrypt.compare(password,foundUser.password)

    if(!comparePassword){
      return res.json({message : "Password is incorrect"})
    }

    const accessToken =jwt.sign({id : foundUser._id,role:foundUser.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn : '15m'})

    const refreshToken =jwt.sign({id : foundUser._id,role:foundUser.role},process.env.REFRESH_TOKEN_SECRET,{expiresIn : '7d'})

    foundUser.refreshToken = refreshToken

    await foundUser.save()

    res.status(200).json({message : "Login Successfull",accessToken,refreshToken,data:foundUser})

  } catch (error) {
    res.status(500).json({message:error.message})
  }
}


const refresh = async(req,res)=>{
  try {
    const {refreshToken} = req.body

    if(!refreshToken){
      return res.status(401).json({message :"Refresh token is required"})
    }

    const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)

    const foundUser = await User.findById(decoded.id);

    if(!foundUser || foundUser.refreshToken !== refreshToken){
      return res.json({message :"Invalid Refresh Token"})
    }

    const accessToken =  jwt.sign({id:foundUser._id,role:foundUser.role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'})

    return res.status(200).json({message : "Access Token refreshed successfully",accessToken})

  } catch (error) {
    return res.status(403).json({ message: "Refresh token is invalid or expired"
    });
  }
}

module.exports = {signup,login,refresh}