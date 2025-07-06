import { Resolver } from '@nestjs/graphql';

import { Args, Mutation } from '@nestjs/graphql';
import {
  FileUpload,
  GraphQLUpload,
} from 'graphql-upload/graphqlUploadExpress.js';
import { GoogleDriveService } from '../google-drive/google-drive.service';

@Resolver()
export class UploadResolver {
  constructor(private readonly driveService: GoogleDriveService) {}

  @Mutation(() => Boolean)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: Promise<FileUpload>
  ) {
    const { createReadStream, filename, mimetype } = await file;

    const stream = createReadStream();

    const uploadedFile = await this.driveService.uploadFile(
      stream,
      filename,
      mimetype
    );
    return uploadedFile.id; // Return Google Drive file ID
  }
}
