interface linkObj {
  link: string;
  siteName: string;
}

function twitter(link: string): linkObj | undefined {
  return link.match(/^http(s?):\/\/((www\.)?)twitter\.com\/(.*?)\/status/)
    ? { link: `https://publish.twitter.com/oembed?url=${link}&theme=light&align=center`, siteName: 'twitter' }
    : undefined;
}

function youtube(link: string): linkObj | undefined {
  return link.match(/^http(s?):\/\/((www\.)?)youtube\.com\/watch\?v=(.*?)/)
    ? { link: link, siteName: 'youtube' }
    : undefined;
}

function codepen(link: string): linkObj | undefined {
  return link.match(/^http(s?):\/\/((www\.)?)codepen\.io\/(.*?)\/pen\/(.*?)/)
    ? { link: link, siteName: 'codepen' }
    : undefined;
}

function jsfiddle(link: string): linkObj | undefined {
  return link.match(/^http(s?):\/\/((www\.)?)jsfiddle\.net\/(.*?)\/(.*?)/)
    ? { link: link, siteName: 'jsfiddle' }
    : undefined;
}

function codesandbox(link: string): linkObj | undefined {
  return link.match(/^http(s?):\/\/((www\.)?)codesandbox\.io\/(s|embed)\/(.*?)/)
    ? { link: link, siteName: 'codesandbox' }
    : undefined;
}

function githubGist(link: string): linkObj | undefined {
  return link.match(/^http(s?):\/\/((www\.)?)gist\.github\.com\/(.*?)\/(.*?)/)
    ? { link: link, siteName: 'githubgist' }
    : undefined;
}

function speakerDeck(link: string): linkObj | undefined {
  return link.match(/^http(s?):\/\/((www\.)?)speakerdeck\.com\/(.*?)\/(.*?)/)
    ? { link: `https://speakerdeck.com/oembed.json?url=${link}`, siteName: 'speakerdeck' }
    : undefined;
}

function slideShare(link: string): linkObj | undefined {
  return link.match(/^http(s?):\/\/((www\.)?)slideshare\.net\/(.*?)/)
    ? { link: link, siteName: 'slideshare' }
    : undefined;
}

function stackBlitz(link: string): linkObj | undefined {
  return link.match(/^http(s?):\/\/((www\.)?)stackblitz\.com\/(edit|github)\/(.*?)/)
    ? { link: link, siteName: 'stackblitz' }
    : undefined;
}

export default function domainCheck(link: string): linkObj | undefined {
  return (
    twitter(link) ||
    youtube(link) ||
    codepen(link) ||
    jsfiddle(link) ||
    codesandbox(link) ||
    githubGist(link) ||
    speakerDeck(link) ||
    // slideShare(link) ||
    stackBlitz(link) ||
    undefined
  );
}
