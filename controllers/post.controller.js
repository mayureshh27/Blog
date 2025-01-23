import ImageKit from "imagekit";
import Post from "../models/post.model.js"
import User from "../models/user.model.js";
import dotenv from "dotenv"
dotenv.config();

export const createPost = async (req, res) => {
    try {

        // Check if the user exists (req.user is set by authMiddleware)
        const userExists = await User.findById(req.user._id)
        if (!userExists) {
            return res.status(401).json({

                message: "User not found. Please log in first.",
            });
        }
        //slug counter for frontend 
        let slug = req.body.title.replace(/ /g, "-").toLowerCase();

        let existingPost = await Post.findOne({ slug });

        let counter = 2;

        while (existingPost) {
            slug = `${slug}-${counter}`;
            existingPost = await Post.findOne({ slug });
            counter++;
        }
        // Create a new post with the user's ID and the request body
        const newPost = new Post({
            user: req.user._id,
            slug: slug,
            // Attach the user ID to the post
            ...req.body, // Spread other fields from the request body
        });

        const post = await newPost.save(); // Save the post to the database
        const populated = await newPost.populate('user', 'username')
        return res.status(200).json({
            message: "Post created successfully",
            post: populated,
        });
    } catch (error) {
        // Check for MongoDB duplicate key error
        if (error.code === 11000 && error.keyPattern?.slug) {
            return res.status(400).json({
                message: `The slug "${req.body.slug}" already exists. Please choose a unique slug.`,
            });
        }

        console.error("Error creating post:", error.message);
        return res.status(500).json({
            message: "Error creating post. Please try again later.",
        });
    }
};


//getting all the posts 
export const getPosts = async (req, res) => {
    const posts = await Post.find().populate('user', 'username');
    res.status(200).json(posts);
    console.log("Got all posts");
};


//getting post by selecting a slug(a particular topic)
export const getPostBySlug = async (req, res) => {
    const slugPost = await Post.findOne({ slug: req.params.slug });
    res.status(200).json(slugPost);
    console.log(`got post by ${slugPost}`);
};

//delete the post by ID 

export const deletePost = async (req, res) => {
    try {
        // Find the post by its ID and delete it
        const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id }); // Make sure the user owns the post

        if (!post) {
            return res.status(403).json({ message: 'Post not found or you do not have permission to delete this post' });
        }

        // Populate the user field with the username after deletion
        const populatedPost = await Post.findById(post._id).populate('user', 'username');

        res.status(200).json({
            message: 'Post has been deleted',
            post: populatedPost,  // Send the populated post (includes username)
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
};


//image kit initialization for image uploading in real time 
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,

});

export const uploadImage = (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
};