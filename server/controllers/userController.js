import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from'jsonwebtoken'

//register user
 export const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body

        if(!name||!email||!password){
            return res.json({success:false,message:"Missing Details"})
        }
         //  does user already exist?
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: 'User already exists, please log in' });
    }
        
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const userData={
            name,
            email,
            password:hashedPassword
        }

        const newUser=new userModel(userData)
        const user=await newUser.save()

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)

         res.json({success:true,message:"Registered succesfully",user:{name:user.name},token})

    }
    catch(e){
        console.log(error)
        res.json({success:false,message:e.message})
    }
}

//login user
export const loginUser=async (req,res)=>{
    try{
        const {email,password}= req.body
        
        const user=await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"User does not exist"})
        }

        const isMatch=await bcrypt.compare(password,user.password)

        if(isMatch){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,message:"Logged in successfully",user:{name:user.name},token})
        }
        else{
            return res.json({success:false,message:"Invalid Credentials"})
        }
        }
    catch(e){
        console.log(error)
        res.json({success:false,message:e.message})
    }
}

//user credits
export const userCredits=async(req,res)=>{
    try{
        const userId=req.userId

        const user=await userModel.findById(userId)

       return res.json({success:true,credits:user.creditBalance,user:{name:user.name}})

    }
    catch(e){
        console.log(e.message)
        res.json({success:false,message:e.message})
    }
}


//payment
export const payment=async (req,res)=>{
    try{
        const userId=req.userId
        const {credits}=req.body

       
        if(!userId||!credits){
            return res.json({success:false,message:"Missing details"})
        }

         const userData=await userModel.findById(userId)

         const creditBalance=userData.creditBalance+credits

         await userModel.findByIdAndUpdate(userId,{creditBalance})

        return res.json({success:true,message:'Credits Added'})

    }
    catch(e){
        console.log(e)
        res.json({success:false,message:e.message})
    }
}
