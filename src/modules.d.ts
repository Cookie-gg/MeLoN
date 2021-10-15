declare module 'ogp-parser' {
  export default function OgJp(
    url: string,
    ops?: { skipOembed: boolean },
  ): Promise<{
    title: string;
    ogp: {
      [key: string]: string[];
    };
    seo: {
      [key: string]: string[];
    };
    oembed: {
      [key: string]: string[];
    };
  }>;
}
declare module 'markdown-it-attrs';
declare module 'markdown-it-katexx';
declare module 'markdown-it-imsize';
declare module 'markdown-it-footnote';
declare module 'markdown-it-container';
declare module 'markdown-it-sanitizer';
declare module 'markdown-it-named-code-blocks';
