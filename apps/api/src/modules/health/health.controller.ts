import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'rmc-ms-api', timestamp: new Date().toISOString() };
  }
}
