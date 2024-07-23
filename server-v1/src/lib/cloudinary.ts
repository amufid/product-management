import multer, { Multer } from 'multer';
import { NextFunction, Request, Response } from "express";
import {
   v2 as cloudinary,
   UploadApiResponse,
   UploadApiErrorResponse
} from 'cloudinary';

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_SECRET,
});

interface CloudinaryFile extends Express.Multer.File {
   buffer: Buffer;
}

const storage = multer.memoryStorage();

export const upload: Multer = multer({ storage: storage })

export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const file: CloudinaryFile = req.file as CloudinaryFile;

      if (file) {
         const uploadStream = cloudinary.uploader.upload_stream(
            {
               resource_type: 'auto',
               folder: 'uploads',
            } as any,
            (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
               if (err) {
                  console.error('Cloudinary upload error:', err);
                  return next(err);
               }

               if (!result) {
                  console.error('Cloudinary upload error: Result is undefined');
                  return next(new Error('Cloudinary upload result is undefined'));
               }

               req.body.cloudinaryUrl = result.secure_url;
               next();
            }
         )

         uploadStream.end(file.buffer);
      } else {
         next()
      }
   } catch (error) {
      console.error('Error in uploadToCloudinary middleware:', error);
      next(error);
   }
};
