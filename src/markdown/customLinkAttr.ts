import MarkdownIt from 'markdown-it';

export default function customLinkAttr(md: MarkdownIt) {
  md.core.ruler.push('link_attr', (state) => {
    const tokens = state.tokens;
    tokens.forEach((token) => {
      token.children &&
        token.children.forEach((child) => {
          if (child.type === 'link_open' && !child.attrGet('href').match(/cookie-gg\.vercel\.app/)) {
            child.attrPush(['target', '_blank']);
            child.attrPush(['rel', 'noopener']);
          }
        });
    });
  });
}
