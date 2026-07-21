import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus() {
    return {
      status: 'ok',
      service: 'SAFECITY API',
      timestamp: new Date().toISOString(),
    };
  }
}
