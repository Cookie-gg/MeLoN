import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StorageGuard } from './storage.guard';
import { StorageService } from './storage.service';

@UseGuards(StorageGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('upload')
  async upload(@Query('fileName') fileName: string): Promise<{ url: string; name: string }> {
    if (fileName) return this.storageService.upload(fileName);
    else throw new Error('can not accept empty query');
  }
}
