import * as Prism from 'prismjs';
import enablePlugins from './plugins';

enablePlugins();

export default function highlight(content: string, langName: string, hasDiff: boolean): string {
  if (hasDiff) {
    if (langName) {
      return Prism.highlight(content, Prism.languages.diff, `diff-${langName}`);
    } else return Prism.highlight(content, Prism.languages.diff, 'diff');
  } else return Prism.highlight(content, Prism.languages[langName], langName);
}
