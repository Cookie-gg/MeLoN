import MarkdownIt from 'markdown-it';

export default function customLinkAttr(md: MarkdownIt) {
  md.core.ruler.push('link_attr', (state) => {
    const tokens = state.tokens;
    tokens.forEach((token) => {
      token.children &&
        token.children.forEach((child) => {
          const href = child.attrGet('href');
          if (child.type === 'link_open' && href.match(/cookie-gg/) && href.match(/^\#/)) {
            child.attrPush(['target', '_blank']);
            child.attrPush(['rel', 'noopener']);
          }
        });
    });
  });
}
