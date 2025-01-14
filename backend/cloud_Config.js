const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


    cloudinary.config({ 
        cloud_name:  process.env.CLOUD_NAME, 
        api_key:  process.env.API_KEY, 
        api_secret: process.env.API_SECRATE// Click 'View API Keys' above to copy your API secret
    });


    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
          folder: 'Swasthysewa',
          allowerdFormats:["png,jpg,jpeg"], 
          
        },
      });
       
     
      export { cloudinary,storage };