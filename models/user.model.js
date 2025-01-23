import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        img: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        SavedPosts: {
            type: [String],
            default: []
        },
        googleId: {
            type: String,
        },
        isLogin: {
            type: Boolean,
            default: false,
        },
        emailToken: {
            type: String,
        },


    },
    { timestamps: true } // Adds createdAt and updatedAt automatically
);

const User = mongoose.model("User", userSchema);
export default User;