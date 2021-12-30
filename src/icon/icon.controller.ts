import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IconGuard } from './icon.guard';
import { IconService } from './icon.service';

@UseGuards(IconGuard)
@Controller('icon')
export class IconController {
  constructor(private readonly iconService: IconService) {}

  @Get()
  find(@Query('search') search?: string) {
    return this.iconService.find(search);
  }
  @Get('twemoji')
  twemoji(@Query('search') search?: string) {
    return this.iconService.twemoji(search);
  }
}
