import { JwtPayload } from '@nestjs/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
} 