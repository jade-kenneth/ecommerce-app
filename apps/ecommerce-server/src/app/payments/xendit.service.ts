import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class XenditService {
  private readonly baseURL = 'https://api.xendit.co';
  private readonly secretKey = process.env.XENDIT_SECRET_KEY;

  private client() {
    return axios.create({
      baseURL: this.baseURL,

      headers: {
        'Content-Type': 'application/json',
        'api-version': '2024-11-11',
        // Xendit docs authentications
        Authorization:
          'Basic ' + Buffer.from(`${this.secretKey}:`).toString('base64'),
      },
    });
  }

  async post(path: string, data: any) {
    try {
      const res = await this.client().post(path, data);

      return res.data;
    } catch (error) {}
  }

  async get(path: string) {
    const res = await this.client().get(path);
    return res.data;
  }
}
