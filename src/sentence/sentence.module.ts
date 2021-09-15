import { Schema } from 'mongoose';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SentenceService } from './sentence.service';
import { SentenceResolver } from './sentence.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'sentence',
        schema: new Schema({
          text: [String],
          page: String,
          section: String,
        }),
      },
    ]),
  ],
  providers: [SentenceService, SentenceResolver],
})
export class SentenceModule {}
