import express from "express";
import {createpost,getpost,deletePost,likeun,reply,feed,getuserpost} from "../controllers/postController.js";
import { protect } from "../middleware/protect.js";

const router=express.Router();

router.get("/feed",protect,feed);
router.get("/:id",getpost);
router.get("/user/:username",getuserpost);
router.post("/create",protect,createpost);
router.delete("/:id",protect,deletePost);
router.put("/like/:id",protect,likeun);
router.put("/reply/:id",protect,reply);

export default router;