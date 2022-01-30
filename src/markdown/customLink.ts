import MarkdownIt from 'markdown-it';
import domainCheck from './domainCheck';

export default function customLink(md: MarkdownIt) {
  md.core.ruler.push('custom_link', async (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (
        tokens[i].type === 'inline' &&
        tokens[i].children.length < 2 &&
        tokens[i].content.match(/^http(s?):\/\/(.*?)/) &&
        tokens[i].content.split('http').length < 3
      ) {
        const widgetEnable = domainCheck(tokens[i].content);
        if (widgetEnable) {
          tokens[i].type = 'link_widget';
          tokens[i].content = widgetEnable.link;
          tokens[i].info = widgetEnable.siteName;
        } else tokens[i].type = 'link_card';
        tokens.splice(i - 1, 1);
        tokens.splice(i, 1);
      }
    }
  });
  md.renderer.rules.link_card = (...args) => {
    const [tokens, idx] = args;
    return /*html*/ `<div class="link_card"><a href="${tokens[idx].content}" target="_blank" rel="noopener noreferre"></a></div>`;
  };
  md.renderer.rules.link_widget = (...args) => {
    const [tokens, idx] = args;
    const { info, content } = tokens[idx];
    return /*html*/ `<div class="link_widget" title="${info}"><a href="${content}" target="_blank" rel="noopener noreferre">${content}</a></div>`;
  };
}
