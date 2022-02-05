import * as zlib from 'zlib';

export function releaseSort<T>(data: T[]) {
  return data.sort((a: T & { releaseDate: number }, b: T & { releaseDate: number }) => {
    if (a.releaseDate < b.releaseDate) return 1;
    if (a.releaseDate > b.releaseDate) return -1;
    return 0;
  });
}

export function topicSort<T>(data: T & { topics: string[] }) {
  data.topics = data.topics.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
  return data;
}

export function gzip(str: string) {
  const content = encodeURIComponent(str); // エンコード
  const result = zlib.gzipSync(content); // 圧縮
  const value = result.toString('base64'); // Buffer => base64変換
  return value;
}
export function unzip(value: string) {
  const buffer = Buffer.from(value, 'base64'); // base64 => Bufferに変換
  const result = zlib.unzipSync(buffer).toString(); // 復号化
  const str = decodeURIComponent(result); // デコード (utf-8)
  return str;
}
