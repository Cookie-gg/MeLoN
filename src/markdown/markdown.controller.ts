import { FastifyReply } from 'fastify';
import { gzip, unzip } from 'src/common';
import { MarkdownGuard } from './markdown.guard';
import { MarkdownService } from './markdown.service';
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';

@UseGuards(MarkdownGuard)
@Controller('md')
export class MarkdownController {
  constructor(private readonly markdownItService: MarkdownService) {}

  @Post()
  async parse(@Body() body: { data: string }, @Res() res: FastifyReply) {
    console.log(body.data);
    const md = unzip(body.data);
    const html = await this.markdownItService.render(md);
    return res.send(gzip(html));
  }
}
