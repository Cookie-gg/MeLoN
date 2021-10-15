import { Response } from 'express';
import { MarkdownService } from './markdown.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MarkdownGuard } from './markdown.guard';

@UseGuards(MarkdownGuard)
@Controller('markdown')
export class MarkdownController {
  constructor(private readonly markdownItService: MarkdownService) {}

  @Post('json')
  @HttpCode(200)
  async json(@Body() body: { data: string }, @Res() res: Response) {
    return res.end(
      JSON.stringify(await this.markdownItService.render(body.data)),
    );
  }

  @Post('string')
  @HttpCode(200)
  async string(@Body() body: { data: string }, @Res() res: Response) {
    return res.end(await this.markdownItService.render(body.data));
  }
}
