import * as Prism from 'prismjs';
import MarkdownIt from 'markdown-it';
import highlight from './prismjs/highlight';

function parseInfo(info: string): { langName?: string; fileName?: string; hasDiff: boolean } {
  const [_, fileName] = info.split(':');
  const splitedInfo = _.split(' ');
  const langName = splitedInfo[splitedInfo.length > 1 ? 1 : 0];
  return {
    langName: Prism.languages[langName] === undefined ? undefined : langName,
    fileName,
    hasDiff: splitedInfo.length > 1 || splitedInfo[0] === 'diff',
  };
}

export default function customCodeBlock(md: MarkdownIt) {
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, config] = args;
    const { info, content } = tokens[idx];
    // const content = tokens[idx].content.replaceAll(/\\/g, '');
    const { langName, hasDiff, fileName } = parseInfo(info);
    if (info === 'mermaid') return /*html*/ `<div class="mermaid">${content}</div>`;
    else if (!langName && !hasDiff) {
      return /*html*/ `<pre ${fileName ? ' class="named-fence-block"' : ''}><code>${content}</code>${
        fileName ? /*html */ `<div class="named-fence-filename">${fileName}</div>` : ''
      }</pre>`;
    } else {
      const className = `${config.langPrefix}${langName && hasDiff ? 'diff-' : ''}${
        !langName && hasDiff ? 'diff' : langName
      }`;
      return /*html*/ `<pre class="${className}${
        fileName ? ' named-fence-block' : ''
      }"><code class="${className}">${highlight(content, langName, hasDiff)}</code>${
        fileName ? /*html*/ `<div class="named-fence-filename">${fileName}</div>` : ''
      }</pre>`;
    }
  };
}
