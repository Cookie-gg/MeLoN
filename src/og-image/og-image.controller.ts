import { Response } from 'express';
import { OgImageService } from './og-image.service';
import { Controller, Get, Header, HttpCode, Param, Res } from '@nestjs/common';

@Controller('og-image')
export class OgImageController {
  constructor(private readonly ogImageService: OgImageService) {}

  @Get('/page/:title/display')
  @HttpCode(200)
  @Header('Content-Type', 'image/png')
  async displayOgPage(@Param('title') title: string, @Res() res: Response) {
    const data = await this.ogImageService.page(title);
    res.set('Content-Length', `${data.buffer.length}`);
    return res.send(data.buffer);
  }

  @Get('/article/:title/display')
  @HttpCode(200)
  @Header('Content-Type', 'image/png')
  async displayoOgArticle(@Param('title') title: string, @Res() res: Response) {
    const data = await this.ogImageService.article(title);
    res.set('Content-Length', `${data.buffer.length}`);
    return res.send(data.buffer);
  }

  @Get('/page/:title')
  @HttpCode(200)
  async OgPage(@Param('title') title: string, @Res() res: Response) {
    const data = await this.ogImageService.page(title);
    return res.end(data.dataURL);
  }
  @Get('/article/:title')
  @HttpCode(200)
  async OgArticle(@Param('title') title: string, @Res() res: Response) {
    const data = await this.ogImageService.article(title);
    return res.send(data.dataURL);
  }
}
