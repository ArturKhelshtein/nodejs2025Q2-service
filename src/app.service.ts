import { Injectable } from '@nestjs/common';
import 'dotenv/config';

const PORT = process.env.PORT || 4000;

@Injectable()
export class AppService {
  getHello(): string {
    return `Welcome to Home Music Library Service! Go to http://localhost:${PORT}/doc`;
  }
}
