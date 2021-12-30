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

declare module '@iconify/json' {
  export default class icons {
    static locate(fileName: string): string; // return json file path
    static collections(): {
      // return all icon info
      name: string;
      total: number;
      author: string;
      url: string;
      license: string;
      licenseURL: string;
      height: number;
      samples: string[];
      version: string;
      palette: string;
      category: string;
    } | null;
  }
}
