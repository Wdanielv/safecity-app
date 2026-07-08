import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus() {
    return {
      status: 'ok',
      service: 'safecity-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
