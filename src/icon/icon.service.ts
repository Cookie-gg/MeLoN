import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { Injectable } from '@nestjs/common';
import type { IconObject } from 'src/types/common';

@Injectable()
export class IconService {
  async test() {
    const readFile = util.promisify(fs.readFile);
    return JSON.parse(
      await readFile(
        path.join(process.cwd(), 'node_modules/@iconify/json/json', 'bx.json'),
        'utf-8',
      ),
    );
  }
  async collections(): Promise<string[]> {
    const readFile = util.promisify(fs.readFile);
    return Object.keys(
      JSON.parse(
        await readFile(
          path.join(
            process.cwd(),
            'node_modules/@iconify/json/collections.json',
          ),
          'utf-8',
        ),
      ),
    );
  }
  async find(search?: string) {
    const readFile = util.promisify(fs.readFile);
    const collections = await this.collections();
    const icons: { name: string; code: string; icons: string[] }[] = [];
    await Promise.all(
      collections.map(async (name) => {
        const json: IconObject = JSON.parse(
          await readFile(
            path.join(
              process.cwd(),
              'node_modules/@iconify/json/json',
              `${name}.json`,
            ),
            'utf-8',
          ),
        );
        const sortedIcons = Object.keys(json.icons).filter((icon) =>
          search
            ? icon.match(search.replaceAll(/\.|,|\-/g, '').toLowerCase()) &&
              icon
            : icon,
        );
        if (sortedIcons.length > 0) {
          icons.push({ name: json.info.name, code: name, icons: sortedIcons });
        }
      }),
    );
    return icons;
  }
  async twemoji(search?: string) {
    const readFile = util.promisify(fs.readFile);
    const twemojis: {
      name: string;
      emojis: {
        name: string;
        text: string;
        unicode: string;
        keywords: string[];
      }[];
    }[] = JSON.parse(
      await readFile(path.join(process.cwd(), 'json/twemoji.json'), 'utf8'),
    );
    if (search) {
      const result: { name: string; text: string; unicode: string }[] = [];
      twemojis.map((genre) => {
        genre.emojis
          .filter((emoji) => {
            for (let i = 0; i < emoji.keywords.length; i++) {
              if (emoji.keywords[i].match(search)) return emoji;
            }
          })
          .map(
            (emoji) =>
              emoji &&
              result.push({
                name: emoji.name,
                text: emoji.text,
                unicode: emoji.unicode,
              }),
          );
      });
      return result;
    } else
      return twemojis.map((genre) => ({
        name: genre.name,
        emojis: genre.emojis.map((emoji) => ({
          name: emoji.name,
          text: emoji.text,
          unicode: emoji.unicode,
        })),
      }));
  }
}
