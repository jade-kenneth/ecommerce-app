import { Resolver } from '@nestjs/graphql';

import { Args, Mutation } from '@nestjs/graphql';
import {
  FileUpload,
  GraphQLUpload,
} from 'graphql-upload/graphqlUploadExpress.js';
import { CloudinaryService } from '../cloudinary/cloudinary/cloudinary.service';
import { GoogleDriveService } from '../google-drive/google-drive.service';
@Resolver()
export class UploadResolver {
  constructor(
    private readonly driveService: GoogleDriveService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  // @Mutation(() => Boolean)
  // async uploadFileNotUsed(
  //   @Args({ name: 'file', type: () => GraphQLUpload }) file: Promise<FileUpload>
  // ) {
  //   const { createReadStream, filename, mimetype } = await file;

  //   const stream = createReadStream();

  //   const uploadedFile = await this.driveService.uploadFile(
  //     stream,
  //     filename,
  //     mimetype
  //   );
  //   return uploadedFile.id; // Return Google Drive file ID
  // }

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: Promise<FileUpload>
  ): Promise<string> {
    const { createReadStream } = await file;

    const result = await this.cloudinaryService.uploadFile(createReadStream());

    return result.secure_url;
  }
}
