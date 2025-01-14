import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload';

import { createProducts } from './controllers/productController.js';
const app = express();
dotenv.config();
app.use(express.json()); // Ensure this is before your routes
app.use(express.urlencoded({ extended: true })); 

app.use(cors()); // Correctly using cors
// app.use(bodyParser.json()); // Correctly using body-parser



app.use(bodyParser.json()); // Parses JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}));

const PORT = process.env.PORT || 3003;
const url = process.env.MONGO_URL;



mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("DB connection error: ", err);
  });

// Define routes
app.use("/createProducts", createProducts);

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 },
  }));

    // cloudynary Configuration
    cloudinary.config({ 
        cloud_name:  process.env.CLOUD_NAME, 
        api_key:  process.env.API_KEY, 
        api_secret: process.env.API_SECRATE// Click 'View API Keys' above to copy your API secret
    });

// Start the server
app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
