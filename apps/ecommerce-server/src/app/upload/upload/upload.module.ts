import { Module } from '@nestjs/common';
import { GoogleDriveService } from '../google-drive/google-drive.service';
import { UploadResolver } from './upload.resolver';

@Module({
  providers: [GoogleDriveService, UploadResolver],
  exports: [GoogleDriveService],
})
export class UploadModule {}
