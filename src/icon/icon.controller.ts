import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IconGuard } from './icon.guard';
import { IconService } from './icon.service';

@UseGuards(IconGuard)
@Controller('icon')
export class IconController {
  constructor(private readonly iconService: IconService) {}

  @Get()
  find(@Query('search') search?: string, @Query('index') index?: number, @Query('limit') limit?: number) {
    return this.iconService.find(search, index, limit);
  }

  @Get('twemoji')
  twemoji(@Query('search') search?: string) {
    return this.iconService.twemoji(search);
  }

  @Get('collections')
  collections() {
    return this.iconService.collections();
  }
}
