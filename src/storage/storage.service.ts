import { Injectable } from '@nestjs/common';
import { Storage, StorageOptions } from '@google-cloud/storage';

@Injectable()
export class StorageService {
  async upload(fileName: string): Promise<{ url: string; name: string }> {
    // try {
    const opts: StorageOptions = process.env.PORT
      ? { keyFile: JSON.parse(`${process.env.GCP_SA_KEY}`) }
      : { keyFilename: 'gae-key.json' };
    const storage = new Storage(opts);
    const bucket = storage.bucket('lemon-storage');
    await bucket.setCorsConfiguration([
      {
        origin: [`${process.env.FRONT_URL}`],
        responseHeader: ['content-type'],
        method: ['PUT'],
        maxAgeSeconds: 3600,
      },
    ]);
    const now = new Date();
    const name = `${Math.random().toString(32).substring(2)}_${now.getFullYear()}${('0' + now.getMonth() + 1).slice(
      -2,
    )}${now.getDate()}_${fileName}`; // id_date_name
    const [url] = await bucket.file(name).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
      contentType: 'application/octet-stream',
    });
    return { url, name };
    // } catch (e) {
    //   if (e instanceof Error) {
    //     return { success: false, e };
    //   }
    // }
  }
}
