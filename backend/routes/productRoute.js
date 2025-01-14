// import express from 'express'
// import multer from 'multer';
// const router = express.Router();
// const upload = multer{{storage}};


// // Get all products
// router.get("/", async (req, res) => {
//     const products = await Product.find();
//     res.json(products);
// });

// // Add a new product
// router.post("/create", async (req, res))
// .post(upload.single ("listing[image]"),(req,res) =>{
//     res.send(req.file);
// })
// //     // const product = new Product(req.body);
// //     await product.save(); 
// //     // res.json(product);

   
// // });



// exports = router;


import express from 'express';
import multer from 'multer';
import Product from './models/Product.js'; // Assuming you have a Product model

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});
const upload = multer({ storage });

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new product
router.post("/create", upload.single("listing[image]"), async (req, res) => {
    try {
        const productData = req.body;
        const imagePath = req.file ? req.file.path : null; // Save file path if uploaded

        const product = new Product({ ...productData, image: imagePath });
        await product.save();

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export the router
export default router;
