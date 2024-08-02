import express from "express";
import {signupuser,loginuser,logout,followUnUser,updateuser,getprofile, alluser} from "../controllers/userController.js";
import { protect } from "../middleware/protect.js";

const router=express.Router();

router.get("/profile/:query",getprofile);
router.get("/alluser",alluser);
router.post("/sign",signupuser);
router.post("/login",loginuser);
router.post("/logout",logout);
router.post("/follow/:id",protect,followUnUser);
router.put("/update/:id",protect,updateuser);


export default router;