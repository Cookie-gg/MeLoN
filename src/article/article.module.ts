import { Schema } from 'mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicModule } from 'src/topic/topic.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'article',
        schema: new Schema({
          articleId: String,
          releaseDate: Date,
          updateDate: Date,
          title: String,
          emoji: String,
          type: String,
          topics: [String],
          body: String,
        }),
      },
    ]),
    forwardRef(() => TopicModule),
  ],
  providers: [ArticleService, ArticleResolver],
  exports: [ArticleService, ArticleResolver],
})
export class ArticleModule {}
