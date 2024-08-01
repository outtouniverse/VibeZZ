import Post from "../models/postModel.js"
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary } from "cloudinary"; 
import token_cookie from "../utils/helpers/token_cookie.js";
import mongoose from "mongoose";

//register
const signupuser=async(req,res)=>{
    try {
        const {name,email,username,password}=req.body;
        const user=await User.findOne({
            $or:[{email},{username}]});
        if(user){
            return res.status(400).json({error:"User already Exists!!"});
        }
        
        const salt=await bcrypt.genSalt(10);

        const hashedpass=await bcrypt.hash(password,salt);
        
        const newuser=new User({
            name, 
            email,
            username,
            password:hashedpass,
        })
        await newuser.save();

        if(newuser){
            token_cookie(newuser._id,res);
            res.status(201).json({
                _id:newuser._id,
                name:newuser.name,
                email:newuser.email,
                username:newuser.username,
                bio:newuser.bio,
                profilepic:newuser.profilepic,

            
            })
        }else{
            res.status(400).json({error:"Invalid Data"})
        }

    } catch (error) {
        res.status(500).json({error:error.message})
        console.log("Error in signupuser",error.message)
        
    }

};

const loginuser=async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        const ispassword=await bcrypt.compare(password,user?.password || "");

        if(!user || !ispassword) return res.status(400).json({error:"Invalid username or password"});
logout
        token_cookie(user._id,res);

        res.status(200).json({
            _id:user._id,
                name:user.name,
                email:user.email,
                username:user.username,
                bio:user.bio,
                profilepic:user.profilepic,
        })

        
    } catch (error) {
        res.status(500).json({error:error.message});
        
    }

};

const logout=async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:1});
        res.status(200).json({message:"User logget out successfully"});
    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("Error ")
        
    }

};
const followUnUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user._id;

        console.log(`Current User ID: ${currentUserId}`); 
        console.log(`Target User ID: ${id}`); 

        if (id == currentUserId) {
            return res.status(400).json({ error: "You can't follow or unfollow yourself" });
        }

        const usertomod = await User.findById(id);
        const currentuser = await User.findById(currentUserId);

        if (!usertomod || !currentuser) {
            return res.status(400).json({ error: "User not found" });
        }

        const isfollow = currentuser.following.includes(id);

        if (isfollow) {
            await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } });
            return res.status(200).json({ message: "User unfollowed" });
        } else {
            await User.findByIdAndUpdate(currentUserId, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: currentUserId } });
            return res.status(200).json({ message: "User followed" });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error occurred" });
    }
};

const updateuser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

        await Post.updateMany(
            {"replies.userId":userId},
            {
                $set: {"replies.$[reply].username": user.username, "replies.$[reply].userProfilePic":user.profilePic}
            },
            {
                arrayFilters: [{"reply.userId": userId}]
            }

        )


		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};
const getprofile=async(req,res)=>{
    const {query}=req.params;
 try {
        let user;
        if(mongoose.Types.ObjectId.isValid(query)){
            user=await User.findOne({_id:query}).select("-password").select("-updatedAt")
        }else{
            user=await User.findOne({username:query}).select("-password").select("-updatedAt")
        }
    if(!user) return res.status(400).json({error:"User doesnt exist"});

    res.status(200).json(user);
 } catch (error) {
    res.status(400).json({error:error.message});
    console.log(error.message);
    
 }
};
const alluser=async(req,res)=>{
    try {
        const users=await User.find().select("-password").select("-updatedAt");
        res.status(200).json(users);
        
    } catch (error) {
        res.status(400).json({error:error.message})
        
    }
}

export  {signupuser,loginuser,logout,followUnUser,updateuser,getprofile,alluser};