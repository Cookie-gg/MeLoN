import * as mongoose from 'mongoose';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ListModule } from './list/list.module';
import { TopicModule } from './topic/topic.module';
import { ArticleModule } from './article/article.module';
import { TitleModule } from './title/title.module';
import { SentenceModule } from './sentence/sentence.module';
import { ImageModule } from './image/image.module';
import { PathModule } from './path/path.module';
import { ConfigModule } from '@nestjs/config';

mongoose.set('useFindAndModify', false);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.PORT ? 'production' : 'development'}`,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://cookie-gg:x9378l1FmJp03opU@page-data.3y2of.mongodb.net/data?retryWrites=true&w=majority',
    ),
    GraphQLModule.forRoot({
      autoSchemaFile: !process.env.GAE_ENV
        ? './src/schema.gql'
        : '/tmp/schema.gql',
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    ListModule,
    TopicModule,
    ArticleModule,
    TitleModule,
    SentenceModule,
    ImageModule,
    PathModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
