import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';
import Renderer from 'markdown-it/lib/renderer';

function escapeCommentOut(
  args: [tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer],
): string {
  const [tokens, idx] = args;
  const { content } = tokens[idx];
  console.log(content);
  if (content.match(/&lt;!--(.*?)--&gt;/)) {
    return '';
  } else return content;
}

export default function customCommentOut(md: MarkdownIt) {
  md.renderer.rules.html_block = (...args) => escapeCommentOut(args);
  md.renderer.rules.html_inline = (...args) => escapeCommentOut(args);
}
