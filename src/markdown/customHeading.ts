import MarkdownIt from 'markdown-it';

export default function customHeading(md: MarkdownIt, options: { levels: number[] }) {
  const targets = new RegExp(`h(${options.levels.toString().split(',').join('|')})`);
  md.renderer.rules.heading_open = (...args) => {
    const [tokens, idx] = args;
    if (
      tokens[idx].tag.match(targets) &&
      tokens[idx + 1].type === 'inline' &&
      tokens[idx + 2].type === 'heading_close'
    ) {
      return /* html */ `<${tokens[idx].tag} id="${encodeURI(tokens[idx + 1].content.replaceAll(/`|\*|~/g, ''))}">`; // exclude inline style
    } else {
      return /* html */ `<${tokens[idx].tag}>`;
    }
  };
}
