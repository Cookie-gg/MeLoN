import { Schema } from 'mongoose';
import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicResolver } from './topic.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from 'src/article/article.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'topic',
        schema: new Schema({
          displayName: String,
          name: String,
          icon: String,
        }),
      },
    ]),
    ArticleModule,
  ],
  providers: [TopicService, TopicResolver],
  exports: [TopicService, TopicResolver],
})
export class TopicModule {}
