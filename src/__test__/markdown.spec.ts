import * as dotenv from 'dotenv';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { gzip, unzip } from 'common';
import { MarkdownController } from 'markdown/markdown.controller';
import { MarkdownService } from 'markdown/markdown.service';
import { Test } from '@nestjs/testing';
import { MarkdownModule } from 'markdown/markdown.module';

describe('MarkdownController', () => {
  let mdController: MarkdownController;
  let mdService: MarkdownService;
  let app: NestFastifyApplication;
  const data = gzip('# heading');

  beforeEach(async () => {
    !process.env.MARKDOWN_SECRET_KEY &&
      dotenv.config({ path: `${__dirname}/.env.${process.env.PORT ? 'production' : 'development.local'}` });

    console.log(process.env.MARKDOWN_SECRET_KEY);

    mdService = new MarkdownService();
    mdController = new MarkdownController(mdService);

    const moduleRef = await Test.createTestingModule({ imports: [MarkdownModule] })
      .overrideProvider(MarkdownService)
      .useValue(mdService)
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('should parse html', async () => {
    const result = '<h1 id="heading">heading</h1>\n';

    expect(unzip(await mdController.parse({ data }))).toBe(result);
  });

  it('/POST md', async () => {
    if (process.env.MARKDOWN_SECRET_KEY) {
      const res = await app.inject({
        method: 'POST',
        path: '/md',
        payload: { data },
        headers: { key: process.env.MARKDOWN_SECRET_KEY },
      });
      expect(unzip(res.body)).toBe(unzip(await mdController.parse({ data })));
    }
  });

  afterAll(async () => {
    await app.close();
  });
});
