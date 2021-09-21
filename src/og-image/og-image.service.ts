import { Injectable } from '@nestjs/common';
import { createCanvas, loadImage, registerFont } from 'canvas';

@Injectable()
export class OgImageService {
  async page(title: string): Promise<Buffer> {
    const WIDTH = 1200 as const;
    const HEIGHT = 630 as const;
    const DX = 0 as const;
    const DY = 0 as const;
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    const backgroundImage = await loadImage(
      `${process.cwd()}/src/public/page-background.png`,
    );
    ctx.drawImage(backgroundImage, DX, DY, WIDTH, HEIGHT);
    registerFont(`${process.cwd()}/src/public/JosefinSans-BoldItalic.ttf`, {
      family: 'Josefin Sans',
    });
    ctx.fillStyle = 'transparent';
    ctx.fillRect(DX, DY, WIDTH, HEIGHT);
    ctx.font = '82.5px "Josefin Sans"';
    ctx.fillStyle = '#1F1F1F';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const IMAGE_X = 600 as const;
    const IMAGE_Y = 400 as const;

    ctx.fillText(title, IMAGE_X, IMAGE_Y);

    const buffer = canvas.toBuffer();
    return buffer;
  }

  async article(title: string): Promise<Buffer> {
    const WIDTH = 1200 as const;
    const HEIGHT = 630 as const;
    const DX = 0 as const;
    const DY = 0 as const;
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    const backgroundImage = await loadImage(
      `${process.cwd()}/src/public/article-background.png`,
    );
    ctx.drawImage(backgroundImage, DX, DY, WIDTH, HEIGHT);
    registerFont(`${process.cwd()}/src/public/NotoSansJP-Bold.otf`, {
      family: 'Noto Sans JP',
    });
    ctx.fillStyle = 'transparent';
    ctx.fillRect(DX, DY, WIDTH, HEIGHT);
    ctx.font = '50px Noto Sans JP';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    let refer = '';
    const linedText: string[] = [];
    for (let i = 0; i < title.length; i++) {
      if (ctx.measureText(`${refer}${title[i]}`).width > 650) {
        linedText.push(refer);
        refer = '';
      } else if (i === title.length - 1) linedText.push(`${refer}${title[i]}`);
      else refer += title[i];
    }

    ctx.fillText(linedText.join('\n'), 150, 315 - 25 * linedText.length);

    const buffer = canvas.toBuffer();
    return buffer;
  }
}
