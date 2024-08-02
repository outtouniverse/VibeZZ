import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDb.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.options('*', cors({
  //origin: 'https://vibe-zz-re.vercel.app',
  credentials: true,
}));



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Server start
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
