import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: 'ecommerce-assets',
      api_key: '241765562813957',
      api_secret: 'kvYPNEPLNN82HV6TpPJ8xlCO53M',
    });
  }

  async uploadFile(stream: NodeJS.ReadableStream): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'ecommerce-assets' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });
  }
}
