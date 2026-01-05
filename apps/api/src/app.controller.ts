import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return { message: 'Diary API is running' };
  }

  @Get('health')
  health() {
    return { ok: true };
  }
}
