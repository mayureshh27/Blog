//import user 
import { signin, signup } from "../controllers/user.controller.js";
import express from "express";
import { verifyEmail } from "../controllers/verifyemail.controller.js";
const router=express.Router();
router.get("/", (req, res) => {
    res.status(200).send("User route is working!");
});
//defining routes 
router.post('/signup', signup);
router.get('/verifyemail',verifyEmail);
router.get('/signin',signin);

export default router