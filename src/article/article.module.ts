import { Schema } from 'mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicModule } from 'topic/topic.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'article',
        schema: new Schema({
          articleId: String,
          published: Boolean,
          releaseDate: Date,
          updateDate: Date,
          title: String,
          emoji: String,
          type: String,
          topics: [String],
          markdown: String,
          html: String,
        }),
      },
    ]),
    forwardRef(() => TopicModule),
  ],
  providers: [ArticleService, ArticleResolver],
  exports: [ArticleService, ArticleResolver],
})
export class ArticleModule {}
