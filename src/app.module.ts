import * as mongoose from 'mongoose';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import AppMiddleware from './app.middleware';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicModule } from './topic/topic.module';
import { AdminModule } from './admin/admin.module';
import { ArticleModule } from './article/article.module';
import { MarkdownModule } from './markdown/markdown.module';
import { MailModule } from './mail/mail.module';
import { IconModule } from './icon/icon.module';

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
        fieldMiddleware: [AppMiddleware],
      },
    }),
    AdminModule,
    TopicModule,
    ArticleModule,
    MarkdownModule,
    MailModule,
    IconModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
