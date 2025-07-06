import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { drive_v3 } from 'googleapis/build/src/apis/drive';
@Injectable()
export class GoogleDriveService {
  private driveClient: drive_v3.Drive;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: './google-drive-credentials.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.driveClient = google.drive({ version: 'v3', auth });
  }
  async uploadFile(
    stream: NodeJS.ReadableStream,
    filename: string,
    mimetype: string
  ): Promise<drive_v3.Schema$File> {
    const res = await this.driveClient.files.create({
      requestBody: {
        name: filename,
        mimeType: mimetype,
        parents: ['1U97umlCr13NtZ5CKiRGht2ii9ny4Az2Q'],
      },
      media: {
        mimeType: mimetype,
        body: stream,
      },
      fields: 'id',
    });

    return res.data;
  }
}
