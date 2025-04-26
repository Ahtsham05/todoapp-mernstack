import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dytrgo2fm',
  api_key: '842765926796613',
  api_secret: '3FeJw5rQ_wH8WzGxxuHCZ9xp4FY'
});

export const uploadOnCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) return reject("No file buffer found");

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        // folder: '',
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Failed:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    // Pipe file buffer to Cloudinary
    Readable.from(file.buffer).pipe(stream);
  });
};
