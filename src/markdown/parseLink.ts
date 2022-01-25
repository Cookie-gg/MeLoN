import axios from 'axios';
import { JSDOM as jsDom } from 'jsdom';

async function getOgp(link: string): Promise<{
  domain: string;
  siteName: string;
  title: string;
  description: string;
  thumbnail?: string | undefined;
  icon?: string;
}> {
  let html: string;
  try {
    const res = await axios.get<string>(link);
    html = res.data;
  } catch (e) {
    html = e.response.data;
  } finally {
    const dom = new jsDom(html);
    const document = dom.window.document;
    function getMeta(property: string, attr = 'property'): string | undefined {
      return document.querySelector(`meta[${attr}="${property}"]`)?.getAttribute('content') || undefined;
    }
    const domain = link.split('/')[2]; // ['https::', "example.com", 'example']
    const siteName = getMeta('og:site_name') || 'no-name';
    const title = getMeta('og:title') || link;
    const description =
      getMeta('og:description') || getMeta(`${siteName.toLowerCase()}:description`, 'name') || 'no-description';
    const thumbnail = getMeta('og:image');
    const icon = getMeta(`${siteName.toLowerCase()}:image`, 'name');
    return { domain, siteName, title, description, thumbnail, icon };
  }
}

async function parseLinkCard(data: string) {
  const dom = new jsDom(data);
  const document = dom.window.document;
  await Promise.all(
    Array.from(document.querySelectorAll('.link_card a')).map(async (el) => {
      const link = el.getAttribute('href');
      const card = document.querySelector(`.link_card a[href="${link}"]`);
      const { domain, title, description, thumbnail, icon } = await getOgp(link);
      card.textContent = '';
      card.insertAdjacentHTML(
        'beforeend',
        /*html*/ `<div class="text_wrapper"><div class="title">${title}</div><div class="description">${description}</div><div class="domain"><img src="https://icons.duckduckgo.com/ip3/${domain}.ico" alt="favicon"><span>${domain}</span></div></div>`,
      );
      if (thumbnail) {
        card.insertAdjacentHTML('beforeend', /*html*/ `<img src="${thumbnail}" alt="og image"/>`);
        card.parentElement.classList.add('image');
        if (icon) card.parentElement.classList.add('both');
      }
      if (icon) {
        card.insertAdjacentHTML('beforeend', /*html*/ `<img src="${icon}" alt="og icon"/>`);
        card.parentElement.classList.add('icon');
      }
    }),
  );
  return dom.serialize().replaceAll(/<(\/?)(html|head|body)>/g, '');
}

async function parseLinkWidget(html: string) {
  const dom = new jsDom(html);
  const document = dom.window.document;
  await Promise.all(
    Array.from(document.querySelectorAll('.link_widget a')).map(async (el) => {
      const link = el.getAttribute('href');
      const info = el.parentElement.getAttribute('title');
      const widget = document.querySelector(`.link_widget a[href="${link}"]`);
      try {
        const data = (await axios.get(link)).data;
        if (info === 'youtube') {
          const returnedHtml = new jsDom(data).window.document;
          if (returnedHtml.querySelector('meta[name="title"]').getAttribute('content') === '') {
            throw new Error('This is not available video.');
          }
        } else if (info === 'twitter') {
          widget.parentElement.innerHTML = data.html;
        } else if (info === 'speakerdeck') {
          const id = data.html.match(/src="(.*?)"/)[1];
          widget.setAttribute('href', `https:${id}`);
          widget.setAttribute('title', data.title);
        } else if (info === 'slideshare') {
          // const key = data.html.match(/src="(.*?)"/)[1];
          const key = 'https://www.slideshare.net/slideshow/embed_code/key/LoUOvWLi7LGVbT';
          widget.setAttribute('href', key);
        }
      } catch (e) {
        if (e instanceof Error) {
          widget.parentElement.className = 'link_card';
        }
      }
    }),
  );
  return dom.serialize().replaceAll(/<(\/?)(html|head|body|script).*?>(\n?)/g, '');
}

export default async function parseLink(data: string) {
  return await parseLinkCard(await parseLinkWidget(data));
}
