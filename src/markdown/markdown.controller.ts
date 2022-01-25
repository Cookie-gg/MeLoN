import { Response } from 'express';
import { MarkdownService } from './markdown.service';
import { Body, Controller, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { MarkdownGuard } from './markdown.guard';

@UseGuards(MarkdownGuard)
@Controller('md')
export class MarkdownController {
  constructor(private readonly markdownItService: MarkdownService) {}

  @Post()
  @HttpCode(200)
  async parse(@Body() body: { data: string }, @Res() res: Response) {
    return res.end(await this.markdownItService.render(body.data));
  }
}
