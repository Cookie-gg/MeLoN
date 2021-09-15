import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TitleResolver } from './title.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'title',
        schema: new Schema({
          text: String,
          page: String,
          section: String,
          icon: { type: String, default: null },
        }),
      },
    ]),
  ],
  providers: [TitleService, TitleResolver],
})
export class TitleModule {}
