import { json } from 'express';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import {v2 as cloudinary } from "cloudinary"; 

const createpost=async(req,res)=>{
    try {
        const {postedBy,text}=req.body;
        let{img}=req.body;
        if(!postedBy || !text){
            return res.status(400).json({error:"All fields required"});

        }
        const user=await User.findById(postedBy);
        if(!user) return res.status(404).json({error:"User not found"});

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"Cant create post for others"});

        }

        const maxlength=500;
        if(text.lenght>maxlength){
            return res.status(400).json({error:`Text must be less than {maxlength}`});
        };

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
        }

        const newPost=new Post({postedBy,text,img});
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        res.status(400).json({error:error.message});
        console.log(error.message);
        
    }

};

const getpost=async(req,res)=>{
try {
    const post=await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({message:"post not found"});
    }
    res.status(200).json(post);
} catch (error) {
    res.status(400).json({message:error.message});
    console.log(error.message);
    
}
};

const deletePost=async(req,res)=>{
try {
    const post=await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message:"Post not found"});

    if(post.postedBy.toString() !==req.user._id.toString()){
        res.status(400).json({error:"Unauthorized"})

    }

    if(post.img){
        const imgId=post.img.split("/").pop().split(".")[0]
        await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Post Deleted Successfully"})
    
} catch (error) {
    res.status(404).json({error:error.message})
    console.log(error.message);
    
}
};

const likeun=async(req,res)=>{
try {
    const {id:postId}=req.params;

    const userId=req.user._id;

    const post=await Post.findById(postId);

    if(!post) return res.status(404).json({message:"Post not found"});

    const userlike=post.likes.includes(userId);
    if(userlike){
        await Post.updateOne({_id:postId},{$pull:{likes:userId}})
        res.status(200).json({message:"Unliked"})
    }else{
        post.likes.push(userId);
        await post.save();
        res.status(200).json({message:"Liked"});

    }
    
} catch (error) {
    res.status(404).json({message:error.message})
    console.log(error.message);
    
}
};

const reply=async(req,res)=>{
    try {
        const {id:postId}=req.params;
        const {text}=req.body;
        const userId=req.user._id;
        const userProfilePic=req.user.profilePic;      
        const username=req.user.username;
      

        if(!text) return res.status(400).json({message:"Text required"});
        const post=await Post.findById(postId);

        if(!post) return res.status(400).json({message:"Post doesnt exist"});
        const reply={userId,text,userProfilePic,username};
        post.replies.push(reply);
        await post.save();

        res.status(200).json(post)

    } catch (error) {
        res.status(404).json({error:error.message})
        console.log(error.message);
    }

};

const feed = async (req, res) => {
    try {
      const userId = req.user._id;
      console.log(`Fetching user with ID: ${userId}`);
      
      const user = await User.findById(userId);
      
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ error: "User not found" });
      }
  
      const following = user.following;
      console.log(`User is following: ${following}`);
    
      if (!following || following.length === 0) {
      
        return res.status(200).json({ feedpost: [] });
      }
  
      const feedpost = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });
      console.log(`Number of posts found: ${feedpost.length}`);
    
      res.status(200).json({ feedpost });
  
    } catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
const getuserpost = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  
  
export {createpost,getpost,deletePost,likeun,reply,feed,getuserpost};