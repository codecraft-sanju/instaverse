import express from 'express';
import dotenv from 'dotenv';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import { connectDb } from './database/db.js';
import userRoute from './routes/userRoutes.js';
import storyRoute from './routes/storyRoutes.js';
import postRoute from './routes/postRoutes.js';
import followRoute from './routes/followRoutes.js';
import CommentRoute from './routes/commentRoutes.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

console.log(` Running in ${process.env.NODE_ENV} mode`);

// Middlewares

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // Allow cookies
  }),
);
app.use(express.json());
app.use(cookieparser());

// Routes
app.use('/api', userRoute);
app.use('/api/stories', storyRoute);
app.use('/api/posts', postRoute);
app.use('/api/follow', followRoute);
app.use('/api/comments',CommentRoute)

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDb();
});
