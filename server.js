import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./config/index.js";

import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import commentRoute from "./routes/comment.routes.js";
dotenv.config();//load the .env variables

const app = express(); // Initialize the express app

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))//cross-origin resource sharing

app.use(express.json()); // parsing json files

app.use(cookieParser()); // parsing the cookie

app.use('/user', userRoute);
app.use('/post', postRoute);
app.use('/comment', commentRoute);

//error handler // express 5 version features 
app.use((error, res, req, next) => {
    res.status(error.status || 500);

    res.json({
        message: error.message || "something went wrong",
        status: error.status,
        stack: error.stack
    })
})


const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    })
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  })
