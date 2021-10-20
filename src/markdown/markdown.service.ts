import Prismjs from 'prismjs';
import Prism from 'markdown-it-prism';
import { Injectable } from '@nestjs/common';
import MarkdownIt = require('markdown-it');
import * as MarkdownItAttrs from 'markdown-it-attrs';
import * as MarkdownItImsize from 'markdown-it-imsize';
import * as MarkdownItKatexx from 'markdown-it-katexx';
import * as MarkdownItFootnote from 'markdown-it-footnote';
import * as MarkdownItContainer from 'markdown-it-container';
import * as MarkdownItSanitizer from 'markdown-it-sanitizer';
import * as MarkdownItNamedCodeBlocks from 'markdown-it-named-code-blocks';
import { unescapeAll } from 'markdown-it/lib/common/utils';

@Injectable()
export class MarkdownService {
  async render(data: string): Promise<string> {
    const md = this.config();
    const options = this.prism();
    md.use(Prism, options);
    const className = ['diff', 'coord', 'add', 'delete'];
    const open = `_${Math.random().toString(32).substring(2)}`;
    const close = `_${Math.random().toString(32).substring(2)}`;
    const lineByLine = data.match(/\r\n|\r|\n/)
      ? data.split(/\r\n|\r|\n/)
      : [data];
    const links: string[] = [];

    data = md.render(
      lineByLine
        .map((value: string, i: number) => {
          // 注釈内のコードブロック対応
          if (value.includes('> ```')) {
            return `> ${open}_${value.replace('> ```', '')}_${close}`;
          }
          // diff コードブロック対応
          else if (value.indexOf('```diff') === 0 && !value.includes('>')) {
            if (lineByLine[i + 1].indexOf('@@') === 0)
              lineByLine[i + 1] =
                open +
                className[0] +
                open +
                className[1] +
                lineByLine[i + 1] +
                className[1] +
                close;
            return value.replace('diff ', '');
          } else if (value.indexOf('+    ') === 0) {
            return open + className[2] + value + className[2] + close;
          } else if (value.indexOf('-    ') === 0) {
            if (lineByLine[i + 1].indexOf('-    ') === 0)
              return open + className[3] + value + className[3] + close;
            else
              return (
                open +
                className[3] +
                value +
                className[3] +
                close +
                className[0] +
                close
              );
          }
          // リンクカード対応
          else if (
            value.indexOf('https://') === 0 ||
            value.indexOf('http://') === 0
          ) {
            links.push(value);
            return value;
          }
          // 他
          else return value;
        })
        .join('\n'),
    );

    // diff コードブロック対応
    className.forEach((value: string) => {
      data = data.replaceAll(`${open}${value}`, `<span class="${value}">`);
      data = data.replaceAll(`${value}${close}`, `</span>`);
    });

    // 注釈内のコードブロック対応
    data = data.replaceAll(`${open}_`, '```');
    data = data.replaceAll(`_${close}`, '');

    // 見出しの抽出
    const h = data.match(/\<(h1|h2).*?\>(.*?)\<\/(h1|h2)\>/g);
    if (h) {
      h.forEach((heading) => {
        data = data.replaceAll(
          heading,
          `<h${heading.split('')[2] === '1' ? 1 : 2} id="${encodeURI(
            heading.replaceAll(/\<(.*?)\>/g, ''),
          )}">${heading
            .replaceAll(/\<(h1|h2).*?\>/g, '')
            .replaceAll(/\<\/(h1|h2)\>/g, '')}</h${
            heading.split('')[2] === '1' ? 1 : 2
          }>`,
        );
      });
    }
    // リンクカード対応
    if (links.length > 0) data = await this.linkCard(data, links);
    // unescapeAll
    data = unescapeAll(data);
    // comment out
    const commentOuts = data.match(
      /\<code.*?\>\n*.*?\n*\<!--.*?--\>\n*.*?\n*\<\/code\>/g,
    );
    if (commentOuts) {
      commentOuts.forEach((co) => {
        data = data.replaceAll(
          co,
          co.replaceAll('<!--', '&lt;!--').replaceAll('-->', '--&gt;'),
        );
      });
    }
    return data;
  }
  async linkCard(data: string, links: string[]): Promise<string> {
    const parser = require('ogp-parser');
    await Promise.all(
      links.map(async (url: string) => {
        const ogLite = await parser(url);
        const title: string = ([ogLite.title] || [
            `${ogLite.ogp['og:site_name']} | ${ogLite.ogp['og:title']}`,
          ] || ['no-title'])[0];
        const description: string = (ogLite.seo.description ||
          (ogLite.ogp['og:site_name'] &&
            ogLite.seo[
              `${(
                ogLite.ogp['og:site_name'][0] as string
              ).toLowerCase()}:description`
            ]) || ['no-description'])[0];
        const ogIcon = ((ogLite.ogp['og:site_name'] &&
          ogLite.seo[
            `${ogLite.ogp['og:site_name'][0].toLowerCase()}:image`
          ]) || [false])[0];
        const ogImage = (ogLite.ogp['og:image'] || [false])[0];

        data = data.replace(
          `<p>${url}</p>`,
          `<div class="link_card ${ogImage && 'image'} ${ogIcon && 'icon'} ${
            ogImage && ogIcon && 'both'
          }"><a href="${url}" target="_blank" rel="noopener noreferrer"><div class="text_wrapper"><div class="title">${title}</div><div class="description">${description}</div><div class="domain"><img src="https://www.google.com/s2/favicons?domain=${
            url.split('/')[2]
          }" alt="favicon" />${url.split('/')[2]}</div>${
            ogImage
              ? ogIcon
                ? `</div><img src="${ogImage}" alt="ogp_image" /><img src="${ogIcon}" alt="ogp_icon" /></a></div>`
                : `</div><img src="${ogImage}" alt="ogp_image" /></a></div>`
              : ogIcon
              ? `</div><img src="${ogIcon}" alt="ogp_image" /></a></div>`
              : ''
          }`,
        );
      }),
    );

    return data;
  }
  config() {
    const md = new MarkdownIt({
      linkify: false,
      html: true,
      breaks: true,
    })
      .use(MarkdownItImsize)
      .use(MarkdownItNamedCodeBlocks)
      .use(MarkdownItKatexx, { throwOnError: false, errorColor: ' #cc0000' })
      .use(MarkdownItContainer, 'details', {
        validate: function (params: string) {
          return params.trim().match(/^details\s+(.*)$/);
        },
        render: function (
          tokens: { info: string; nesting: number }[],
          idx: number,
        ) {
          const m = tokens[idx].info.trim().match(/^details\s+(.*)$/);
          if (m !== null && tokens[idx].nesting === 1) {
            return (
              '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n'
            );
          } else {
            return '</details>\n';
          }
        },
      })
      .use(MarkdownItContainer, 'message', {
        validate(params: string) {
          if (params.trim().match(/^message/))
            return params.trim().match(/^message/);
          else if (params.trim().match(/^message\s+(.*)$/))
            return params.trim().match(/^message\s+(.*)$/);
        },
        render(tokens: { info: string; nesting: number }[], idx: number) {
          const m = tokens[idx].info.trim().match(/^message\s+(.*)$/);
          if (m !== null) {
            if (tokens[idx].nesting === 1) {
              return `<div class='msg ${md.utils.escapeHtml(m[1])}'>`;
            } else {
              return '</div>\n';
            }
          } else {
            if (tokens[idx].nesting === 1) {
              return '<div class="msg">';
            } else {
              return '</div>\n';
            }
          }
        },
      })
      .use(MarkdownItAttrs)
      .use(MarkdownItFootnote)
      .use(MarkdownItSanitizer);

    const linkOpenRender =
      md.renderer.rules.link_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      tokens[idx].attrPush(['target', '_blank']);
      tokens[idx].attrPush(['rel', 'noopner']);
      return linkOpenRender(tokens, idx, options, env, self);
    };

    md.renderer.rules.footnote_block_open = () =>
      '<section class="footnotes">\n' +
      '<div class="footnotes-title">脚注</div>' +
      '<ol class="footnotes-list">\n';

    return md;
  }
  prism() {
    let lv = 0;
    const options = {
      plugins: ['custom-class'],
      init: (prism: typeof Prismjs) => {
        prism.plugins.customClass.add(
          ({ content, type }: { content: string; type: string }) => {
            if (content === '(' || content === '[' || content === '{') {
              lv++;
              return lv % 3 === 1 ? 'yellow' : lv % 3 === 2 ? 'pink' : 'blue';
            } else if (content === ')' || content === ']' || content === '}') {
              lv--;
              return (lv + 1) % 3 === 1
                ? 'yellow'
                : (lv + 1) % 3 === 2
                ? 'pink'
                : 'blue';
            } else if (
              (content === 'export' ||
                content === 'return' ||
                content === 'async' ||
                content === 'await') &&
              type === 'keyword'
            ) {
              return 'red';
            } else if (
              content === ';' ||
              content === '.' ||
              content === ',' ||
              content === ':'
            ) {
              return 'white';
            } else if (content === '=>' && type === 'operator') {
              return 'blue';
            }
          },
        );
      },
    };
    return options;
  }
}
