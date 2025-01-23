import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Find the user by email and set `isVerified` to true
        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found or already verified." });
        }

        res.status(200).json({ message: "Email verified successfully!" });
        console.log("Email verification successful")
    } catch (error) {
        console.error("Error verifying email:", error.message);
        res.status(400).json({ message: "Invalid or expired token." });
    }
};
