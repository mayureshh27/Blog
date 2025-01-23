import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

export const postComment = async (req, res) => {
    try {
        // Ensure the user is logged in
        if (!req.user || !req.user._id) {
            return res.status(403).json({ message: "User not logged in" });
        }

        // Extract user and post data
        const userId = req.user._id;
        const postId = req.params.postId;

        // Verify the user exists in the database
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found." });
        }

        // Create a new comment
        const newComment = new Comment({
            user: userId,
            postId: postId,
            ...req.body, // Assuming `text` is part of req.body
        });

        // Save the comment to the database
        const savedComment = await newComment.save();

        // Return success response
        return res.status(200).json({
            message: `Comment added successfully to post ${postId}.`,
            comment: savedComment,
        });
    } catch (error) {
        console.error("Error posting comment:", error);
        return res.status(500).json({
            message: "An error occurred while posting the comment.",
            error: error.message,
        });
    }
};


//get the posted comments from database
export const getPostComments = async (req, res) => {
    const comments = await Comment.find({ postId: req.params.postId })
        .populate("user", "username img")
        .sort({ createdAt: -1 });

    res.json(comments);
};


//delete the comment from the database 
export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params; // Assuming `commentId` is passed as a parameter
        const userId = req.user._id; // Extract the user ID from the authenticated user

        // Find and delete the comment if it belongs to the user and the specific post
        const comment = await Comment.findOneAndDelete({
            _id: commentId,
            user: userId,
            postId: postId
        });

        if (!comment) {
            return res.status(404).json({
                message: "You are not authorized to delete this comment.",
            });
        }

        // Return success response
        return res.status(200).json({
            message: "Comment deleted successfully.",
            deletedComment: comment,
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({
            message: "An error occurred while deleting the comment.",
            error: error.message,
        });
    }
};
