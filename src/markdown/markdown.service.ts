import { Injectable } from '@nestjs/common';
import MarkdownIt = require('markdown-it');
import * as MarkdownItImsize from 'markdown-it-imsize';
import * as MarkdownItFootnote from 'markdown-it-footnote';
import * as MarkdownItSanitizer from 'markdown-it-sanitizer';
import CustomCodeBlock from './customCodeBlock';
import CustomHeading from './customHeading';
import CustomCommentOut from './customCommentOut';
import CustomLinkAttr from './customLinkAttr';
import CustomContainer from './customContainer';
import CustomLink from './customLink';
import CustomKatex from './customKatex';
import parseLink from './parseLink';

@Injectable()
export class MarkdownService {
  async render(data: string): Promise<string> {
    const md = this.config();
    return await parseLink(md.render(data));
  }
  config() {
    const md = new MarkdownIt({ linkify: false, html: true, breaks: true })
      .use(CustomCodeBlock)
      .use(CustomHeading, { levels: [1, 2] })
      .use(CustomCommentOut)
      .use(CustomLinkAttr)
      .use(CustomLink)
      .use(CustomContainer)
      .use(CustomKatex)
      .use(MarkdownItImsize)
      .use(MarkdownItFootnote)
      .use(MarkdownItSanitizer);

    md.renderer.rules.footnote_block_open = () =>
      /*html*/ `<section class="footnotes"><div class="footnotes-title">脚注</div><ol class="footnotes-list">`;

    return md;
  }
}
