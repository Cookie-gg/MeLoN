import { MarkdownGuard } from './markdown.guard';
import { MarkdownService } from './markdown.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

@UseGuards(MarkdownGuard)
@Controller('md')
export class MarkdownController {
  constructor(private readonly markdownItService: MarkdownService) {}

  @Post()
  async parse(@Body() body: { data: string }) {
    const html = await this.markdownItService.render(body.data);
    return html;
  }
}
