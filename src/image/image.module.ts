import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageResolver } from './image.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'image',
        schema: new Schema({
          data: String,
          name: String,
        }),
      },
    ]),
  ],
  providers: [ImageService, ImageResolver],
})
export class ImageModule {}
