import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Product from '../models/Product';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'ShopCart',
      allowedFormats: ['jpeg', 'png', 'jpg'],
      public_id: req.body.name,
      unique_filename: true,
    };
  },
});

async function destroyCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(`ShopCart/${publicId}`);
  } catch (error) {
    console.error(error);
  }
}

async function renameCloudinary(publicId: string, newPublicId: string) {
  try {
    const result = await cloudinary.uploader.rename(
      `ShopCart/${publicId}`,
      `ShopCart/${newPublicId}`,
      { overwrite: true }
    );

    await Product.findOneAndUpdate(
      { name: newPublicId },
      { $set: { 'image.path': result.url } }
    );
  } catch (error) {
    console.error(error);
  }
}

export { storage, destroyCloudinary, renameCloudinary };
