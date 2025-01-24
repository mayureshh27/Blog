import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        isLogin: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true } // Adds createdAt and updatedAt automatically
);

const User = mongoose.model("User", userSchema);
export default User;