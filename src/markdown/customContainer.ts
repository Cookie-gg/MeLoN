import MarkdownIt from 'markdown-it';

export default function customContainer(md: MarkdownIt) {
  const rex = /:{3}(message alert|message|details)[ ]*([^\n]+)*\s*[\s\S]+?\s*:{3}/gy;
  md.block.ruler.before('fence', 'container', (state, begLine, endLine, silent) => {
    const { src, bMarks, tShift, eMarks } = state;
    // bMark: 行頭文字目, tShift: tab以外のスペースを除き、何文字目から, eMark: 行尾文字目
    const pos = bMarks[begLine] + tShift[begLine];
    const m = src.startsWith(':::', (rex.lastIndex = pos)) && rex.exec(src);
    const res = m && pos < rex.lastIndex;
    if (res && !silent) {
      if (m[1] === 'details' && !m[2]) return false;
      const endPos = rex.lastIndex - 1;
      let curLine = begLine;
      // get a line number has katex_block_close
      for (curLine; curLine < endLine; curLine++)
        if (endPos >= bMarks[curLine] + tShift[curLine] && endPos <= eMarks[curLine]) break;

      const lineMax = state.lineMax;
      const prevParentType = state.parentType;

      state.lineMax = curLine;
      // eslint-disable-next-line
      state.parentType = 'custom_container' as any;

      // container_open
      let token = state.push('container_open', '', 1);
      token = Object.assign(token, { block: true, markup: ':::', info: m[1], map: [begLine, curLine] });
      if (m[2]) token.content = m[2];
      // include content as token
      state.md.block.tokenize(state, begLine + 1, curLine);
      // container_close
      token = state.push('container_close', '', -1);
      // eslint-disable-next-line
      token = Object.assign(token, { block: true, markup: ':::', info: m[1] });

      // be default
      state.parentType = prevParentType;
      state.lineMax = lineMax;
      // skip this katex_block
      state.line = curLine + 1;
    }
    return res;
  });

  md.renderer.rules.container_open = (tokens, idx) => {
    const { info, content } = tokens[idx];
    if (info === 'details') return /*html*/ `<details><summary>${content}</summary><div class="inner">`;
    else return /*html*/ `<div class="msg${info.includes('alert') ? ' alert' : ''}">`;
  };

  md.renderer.rules.container_close = (...args) => {
    const [tokens, idx] = args;
    const { info } = tokens[idx];
    if (info === 'details') return /*html*/ `</div></details>`;
    else return /*html*/ `</div>`;
  };
}
