import * as Prism from 'prismjs';
import enablePlugins from './plugins';
import * as loadLanguages from 'prismjs/components/';

enablePlugins();

function parseGrammer(lang?: string): Prism.Grammar | undefined {
  if (!lang) return undefined;
  if (!Prism.languages[lang]) loadLanguages([lang]);
  return Prism.languages[lang];
}

export default function highlight(content: string, langName: string, hasDiff: boolean): string {
  if (hasDiff) {
    if (langName) {
      return Prism.highlight(content, Prism.languages.diff, `diff-${langName}`);
    } else return Prism.highlight(content, Prism.languages.diff, 'diff');
  } else return Prism.highlight(content, parseGrammer(langName), langName);
}
