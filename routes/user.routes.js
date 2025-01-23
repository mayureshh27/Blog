//import user 
import {logout, signin, signup} from "../controllers/user.controller.js";
import express from "express";
const router=express.Router();

router.get("/", (req, res) => {
    res.status(200).send("User route is working!");
});

//defining routes

router.post('/signup', signup);
router.get('/signin',signin);
router.post('/logout', logout);

export default router