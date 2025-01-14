// import { Product } from "../models/Product.js";
// import { v2 as cloudinary } from "cloudinary";

// export const createProducts = async (req, res) => {
//   try {
//     const { Title, description, price, weight } = req.body;

//     // Validate required fields
//     if (!Title || !description || !price || !weight) {
//       return res.status(400).json({ message: "All fields are required in imh" });
//     }

//     // Check if image is provided
//     if (!req.files || !req.files.image) {
//       return res.status(400).json({ message: "No image provided" });
//     }

//     const image = req.files;

//     // Validate image format
//     const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];
//     if (!allowedFormats.includes(image.mimetype)) {
//       return res.status(400).json({ message: "Please upload a valid image file" });
//     }

//     // Upload image to Cloudinary
//     const result = await cloudinary.uploader.upload(image.tempFilePath, {
//       folder: "products",
//     });

//     // Create product data
//     const productData = {
//       Title,
//       description,
//       price,
//       weight,
//       image: result.secure_url, // Save Cloudinary URL in database
//     };

//     // Save product to database
//     const product = await Product.create(productData);

//     res.status(201).json({
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error creating product" });
//   }
// };

export const createProducts = async (req, res) => {
    try {

      console.log("Request body received:", req.body); // Log request body
      console.log("Request files received:", req.files); // Log uploaded files
  
       
      const { Title, description, price, weight } = req.body;
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No image provided" });
      }
    
  
      // Validate required fields
      if (!Title || !description || !price || !weight) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
         // Check if the image file is present
    if (!req.files || !req.files.image) {
        return res.status(400).json({ message: "No image provided" });
      }
  
      // If the image is present, log its details
    //   const image = req.files.image; 
    const { image } = req.files;
      console.log("Image details:", image);
  
      // Further checks for image (optional)
      if (!["image/jpg", "image/jpeg", "image/png"].includes(image.mimetype)) {
        return res.status(400).json({ message: "Invalid image format" });
      }
  
    //   const { image } = req.files;
  
      // Validate image format
      const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];
      if (!allowedFormats.includes(image.mimetype)) {
        return res.status(400).json({ message: "Please upload a valid image file" });
      }
  
      console.log("Image file details:", image); // Log image details
  
      // Save the image to a folder (e.g., 'uploads')
      const uploadPath = path.join("uploads", image.name);
      await image.mv(uploadPath); // Move the file to the specified path
  
      // Create the product data
      const productData = {
        Title,
        description,
        price,
        weight,
        image: uploadPath, // Save the image path in the database
      };
  
      // Save the product to the database
      const product = await Product.create(productData);
  
      // Respond with the created product
      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error); // Log the error for debugging
      return res.status(500).json({ error: "Error creating product" });
    }
  };
  