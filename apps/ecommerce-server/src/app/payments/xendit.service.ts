import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class XenditService {
  private readonly baseURL = 'https://api.xendit.co';
  private readonly secretKey =
    'xnd_development_6NLQ5QJ90XOyVfK4s6CO3TJwvuexsUn1MKlAHX85LENT1mDqROX5RjP0nWS1FTp4';

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
    } catch (error) {
      console.log(error, 'erorooror');
    }
  }

  async get(path: string) {
    const res = await this.client().get(path);
    return res.data;
  }
}
