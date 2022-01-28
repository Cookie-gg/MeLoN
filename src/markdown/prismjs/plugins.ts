import * as Prism from 'prismjs';
import 'prismjs/plugins/custom-class/prism-custom-class.js';
import enableDiffHighlight from '@steelydylan/prism-diff-highlight';

function levelingPunc(lv: number): string {
  return lv % 3 === 1 ? 'yellow' : lv % 3 === 2 ? 'pink' : 'blue';
}

function customClass(): void {
  let lv = 0;
  Prism.plugins.customClass.add(({ content, type }: { content: string; type: string }) => {
    if (content === '(' || content === '[' || content === '{') {
      lv++;
      return levelingPunc(lv);
    } else if (content === ')' || content === ']' || content === '}') {
      lv--;
      return levelingPunc(lv + 1);
    } else if (content.match(/export|return|declare|try|catch|finally|async|await/) && type === 'keyword') {
      return 'red';
    } else if (content.match(/;|\.|,|\:/)) return 'white';
    else if (content === '=>' && type === 'operator') return 'blue';
  });
}

export default () => {
  customClass();
  enableDiffHighlight();
};