import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as reactEmojiRender from '../node_modules/react-emoji-render/data/aliases.js';
import { Octokit } from '@octokit/rest';
import { Base64 } from 'js-base64';
import * as dotenv from 'dotenv';

(async () => {
  dotenv.config({
    path: `.env.${process.env.PORT ? 'production' : 'development'}`,
  });
  const readFile = util.promisify(fs.readFile);
  const writeFile = util.promisify(fs.writeFile);
  const twemojiSvg = await readFile(
    path.join(
      process.cwd(),
      'node_modules/react-twemoji-picker/data/twemoji.svg',
    ),
    'utf-8',
  );
  const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
  const owner = process.env.GITHUB_OWNER;
  const repo = 'LeMoN';
  const latestCommit = (
    await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch: process.env.PORT ? 'master' : 'preview',
    })
  ).data.commit;

  const rootTree = (
    await octokit.rest.git.getTree({ owner, repo, tree_sha: latestCommit.sha })
  ).data.tree;

  const fileTree = (
    await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: rootTree.find((file) => file.path === 'public')?.sha,
    })
  ).data.tree;

  const blob = (
    await octokit.rest.git.getBlob({
      owner,
      repo,
      file_sha: fileTree.find((file) => file.path === 'twiEmoji.svg')?.sha,
    })
  ).data;

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'public/twiEmoji.svg',
    message: 'Update twiEmoji.svg',
    content: Base64.encode(twemojiSvg),
    sha: blob.sha,
  });

  const emojiSet: { [key: string]: string } = Object.assign(
    {},
    ...Object.keys(reactEmojiRender as { [key: string]: string }).map(
      (key) => ({
        [key.replaceAll('-', '').replaceAll('_', '')]: reactEmojiRender[key],
      }),
    ),
  );
  const twemojiJson: {
    [key: string]: { unicode: string; name: string; keywords: string[] }[];
  } = JSON.parse(
    await readFile(
      path.join(
        process.cwd(),
        'node_modules/react-twemoji-picker/data/twemoji.json',
      ),
      'utf8',
    ),
  );
  try {
    await writeFile(
      path.join(process.cwd(), 'json/twemoji.json'),
      JSON.stringify(
        Object.keys(twemojiJson).map((key) => ({
          name: key,
          emojis: twemojiJson[key]
            .filter(
              (emoji) =>
                emojiSet[emoji.name.replaceAll('-', '').replaceAll('_', '')] &&
                emoji,
            )
            .map((emoji) => ({
              name: emoji.name.replaceAll('_', '-'),
              text: emojiSet[
                emoji.name.replaceAll('-', '').replaceAll('_', '')
              ],
              unicode: emoji.unicode,
              keywords: emoji.keywords,
            })),
        })),
      ),
      'utf8',
    );
  } catch (e) {
    new Error(e.message);
  }
})();
