import { Response } from 'express';
import { OgImageService } from './og-image.service';
import { Controller, Get, Header, HttpCode, Param, Res } from '@nestjs/common';

@Controller('og-image')
export class OgImageController {
  constructor(private readonly ogImageService: OgImageService) {}

  @Get('page/:title')
  @HttpCode(200)
  @Header('Content-Type', 'image/png')
  async ogPage(@Param('title') title: string, @Res() res: Response) {
    const buffer = await this.ogImageService.page(title);
    res.set('Content-Length', `${buffer.length}`);
    return res.send(buffer);
  }
  @Get('article/:title')
  @HttpCode(200)
  @Header('Content-Type', 'image/png')
  async ogArticle(@Param('title') title: string, @Res() res: Response) {
    const buffer = await this.ogImageService.article(title);
    res.set('Content-Length', `${buffer.length}`);
    return res.send(buffer);
  }
}
