import * as katex from 'katex';
import MarkdownIt from 'markdown-it';

export default function customKatex(md: MarkdownIt) {
  const rex = {
    inline: /(\${1,2})((?:\S)|(?:\S(?!.*\]\(http.*\$.*\)).*?\S))\${1,2}/gy,
    block: /\${2}\s*([^($|\>)]+?)\s*\${2}/gmy,
  };

  const validate = (src: string, pos: number, replace: 'prev' | 'next'): boolean => {
    const i = replace === 'prev' ? -1 : 1;
    if (src[pos + i * 1] && src[pos + i * 1].match(/`/)) return false;
    else if (src[pos + i * -1] && src[pos + i * -1].match(/`|\n/)) return false;
    else return true;
  };

  md.inline.ruler.before('escape', 'katex_inline', (state, silent) => {
    const { pos, src } = state; // get a position escape text and string
    const m =
      src.startsWith('$', (rex.inline.lastIndex = pos)) &&
      validate(src, pos, 'prev') &&
      rex.inline.exec(src.replaceAll(/\n/g, '\\n'));
    const res = m && pos < rex.inline.lastIndex && validate(src, rex.inline.lastIndex - 1, 'next');
    if (res) {
      if (!silent) {
        const token = state.push(`katex_${m[1].length < 2 ? 'inline' : 'block'}`, 'math', 0);
        token.content = m[2];
        token.markup = m[1];
      }
      state.pos = rex.inline.lastIndex;
    }
    return res;
  });

  md.block.ruler.before('fence', 'katex_block', function block(state, begLine, endLine, silent) {
    const { src, bMarks, tShift, eMarks } = state;
    // bMark: 行頭文字目, tShift: tab以外のスペースを除き、何文字目から, eMark: 行尾文字目
    const pos = bMarks[begLine] + tShift[begLine];
    const m = src.startsWith('$$', (rex.block.lastIndex = pos)) && rex.block.exec(src);
    const res = m && pos < rex.block.lastIndex;
    if (res && !silent) {
      const endPos = rex.block.lastIndex - 1; // postion the end of katex_block_close
      let curLine = begLine;
      // get a line number has katex_block_close
      for (curLine; curLine < endLine; curLine++)
        if (endPos >= bMarks[curLine] + tShift[curLine] && endPos <= eMarks[curLine]) break;

      const lineMax = state.lineMax;
      const prevParentType = state.parentType;

      state.lineMax = curLine;
      // eslint-disable-next-line
      state.parentType = 'math' as any;

      // katex_block
      let token = state.push('katex_block', 'math', 1);
      // eslint-disable-next-line
      token = Object.assign(token, { block: true, markup: '$$', content: m[1], map: [begLine, curLine] });
      // be default
      state.parentType = prevParentType;
      state.lineMax = lineMax;
      // skip this katex_block
      state.line = curLine + 1;
    }
    return res;
  });

  md.core.ruler.push('katex_block', (state) => {
    const { tokens } = state;
    tokens.map((token) => {
      if (token.type === 'fence' && token.tag === 'code' && token.info === 'math') {
        token = Object.assign(token, { type: 'katex_block', tag: 'math', markup: '$$', info: '' });
      }
    });
  });

  md.renderer.rules.katex_inline = (tokens, idx) => {
    const { content } = tokens[idx];
    try {
      return /*html*/ `<span class="${tokens[idx].type}">${katex.renderToString(content)}</span>`;
    } catch {
      return /*html*/ `<span class="${tokens[idx].type} error">${content}</span>`;
    }
  };

  md.renderer.rules.katex_block = (tokens, idx) => {
    const { content } = tokens[idx];
    try {
      return /*html*/ `<div class="${tokens[idx].type}">${katex.renderToString(content)}</div>`;
    } catch {
      return /*html*/ `<span class="${tokens[idx].type} error">${content}</span>`;
    }
  };
}

// md.core.ruler.push('container', (state) => {
//   const tokens = state.tokens;
//   const range: { start: number; end: number; info: string; title?: string }[] = [];
//   let containerIndex = 0;
//   for (let i = 0; i < tokens.length; i++) {
//     if (tokens[i].tag !== 'code') {
//       const m = tokens[i].content.match(/^:::(message alert|details|message).*?/);
//       if (m) {
//         range.push({ start: i, end: i, info: m[1] });
//         if (m[1] === 'details') {
//           range[containerIndex].title = tokens[i].content.split(/\n/)[0].replace(':::details ', '');
//           // [:::details [title]]\n content \n:::
//         }
//         if (tokens[i].content.match(/(.*?):::$/)) {
//           tokens[i].content = tokens[i].content.split(/\n/)[1]; // :::details title\n[ content ]\n:::
//           tokens[i].children && tokens[i].children.splice(-2, 2);
//           containerIndex++;
//         } else tokens[i].content = tokens[i].content.split(/\n/).splice(1).join('\n');
//         tokens[i].children && tokens[i].children.splice(0, 2);
//       } else if (tokens[i].content.match(/(.*?):::$/)) {
//         tokens[i].content = tokens[i].content.split(/\n/).splice(-2, 1).join('\n');
//         tokens[i].children && tokens[i].children.splice(-2, 2);
//         range[containerIndex].end = i;
//         containerIndex++;
//       }
//     }
//   }
//   range.forEach(({ start, end, info, title }, i) => {
//     const open = new Token('container_open', '', 0);
//     open.info = info;
//     if (title) open.content = title;
//     const close = new Token('container_close', '', 0);
//     close.info = info;
//     tokens.splice(i * 2 + start - 1, 0, open);
//     tokens.splice(i * 2 + end + 3, 0, close);
//   });
// });
