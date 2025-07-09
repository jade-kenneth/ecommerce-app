import { Module } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary/cloudinary.service';
import { GoogleDriveService } from '../google-drive/google-drive.service';
import { UploadResolver } from './upload.resolver';

@Module({
  providers: [GoogleDriveService, UploadResolver, CloudinaryService],
  exports: [GoogleDriveService, CloudinaryService],
})
export class UploadModule {}
