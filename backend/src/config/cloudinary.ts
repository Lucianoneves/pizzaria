import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

const cloud_name = process.env.CLOUDINARY_NAME?.trim();
const api_key = process.env.CLOUDINARY_API_KEY?.trim();
const api_secret = process.env.CLOUDINARY_SECRET?.trim();

if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Variáveis do Cloudinary não configuradas');
}

cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
});

export default cloudinary;
