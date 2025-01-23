import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js"; // Import user routes
import { createProducts } from './controllers/productController.js';



const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true })); 

app.use(cors()); // Correctly using cors
app.use(bodyParser.json()); // Correctly using body-parser



app.use(bodyParser.json()); // Parses JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies


 
const PORT = process.env.PORT || 3003;
const url = process.env.MONGO_URL;

mongoose.connect(url)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("DB connection error: ", err);
  });

  app.use(express.json()); // Ensure this is before your routes
// Routes
app.use("/api/users", userRoutes); // Use the user routes
app.use("/api/users",userRoutes)
app.post('/api/users',userRoutes);


app.use("/createProducts", createProducts);


// Start the server
app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});



