import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../helpers/sendVerificationemail.js";

export const signup = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        const userExists1 = await User.findOne({ username });
        if (userExists1) {
            return res.status(400).json({ message: "Username is ALready in Use,provide a unique Username" });
        }
        if (userExists) {
            return res.status(400).json({ message: "User already exists,Please check your email" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(401).json({ message: "Passwords do not match." });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);
        // Generate a JWT token
        const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2m' });

        // Set cookie with the token
        res.cookie("emailToken", emailToken, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000, // 1 hour
        });

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            emailToken,
            isVerified: false
        });

        // Save user to the database
        await newUser.save();
        await sendVerificationEmail(email, emailToken)//send verification email 


        res.status(201).json({
            message: "User signup successful!",
            newUser: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                emailToken
            },
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Error registering new user." });
    }
};


//Sign -in with email and password 


export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email is valid and exists
        const user = await User.findOneAndUpdate({ email }, { isLogin: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: "User is not verified, please verify your email and then login" });
        }

        // Check if the password is correct
        const isMatch = bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Credentials provided",
            });
        }
        //generate the payload and send it to the server
       
        // Generate JWT token
        const token = jwt.sign({_id:user._id,email:user.email}, process.env.JWT_SECRET, { expiresIn: "2h" });

        // Set the cookie before sending the response
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
            sameSite: 'strict', // Prevents CSRF attacks
            maxAge: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
        });

        // Send the JSON response
        return res.status(200).json({
            username: user.username,
            message: "Login Successful",
            token, // Optional: You can include the token in the response if needed
        });
      
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Error in Login." });
    }
};





