import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'

dotenv.config();

const cloud_name = process.env.CLOUD_NAME || "error";
const api_key = process.env.CLOUDINARY_API_KEY || "errpr";
const api_secret = process.env.CLOUDINARY_API_SECRET || "error";

cloudinary.config({
    cloud_name,
    api_key,
    api_secret
});

export default cloudinary;