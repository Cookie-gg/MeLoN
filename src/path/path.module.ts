import { Module } from '@nestjs/common';
import { PathService } from './path.service';
import { PathResolver } from './path.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'path',
        schema: new Schema({
          name: String,
          path: String,
          icon: String,
          order: Number,
        }),
      },
    ]),
  ],
  providers: [PathService, PathResolver],
})
export class PathModule {}
