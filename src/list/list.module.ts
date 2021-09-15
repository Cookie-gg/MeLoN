import { Schema } from 'mongoose';
import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListResolver } from './list.resolver';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'list',
        schema: new Schema({
          list: [
            {
              title: String,
              icon: { type: String, default: null },
            },
          ],
          name: String,
          page: String,
          section: String,
        }),
      },
    ]),
  ],
  providers: [ListService, ListResolver],
})
export class ListModule {}
