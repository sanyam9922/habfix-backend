import "dotenv/config"
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

async function handleUpload(file: any) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return res.url;
}

export { handleUpload };