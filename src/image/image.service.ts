import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { ImageInput, ImageType } from './image.model';

@Injectable()
export class ImageService {
  constructor(@InjectModel('image') private readonly model: Model<ImageType>) {}

  async create(dto: ImageInput): Promise<ImageType> {
    const image = await this.model.findOne({ name: dto.name });
    if (image) {
      throw new NotFoundException('Do not post a image of used name');
    }
    const newImage = new this.model(dto);
    return await newImage.save();
  }

  async find(name: string): Promise<ImageType> {
    const image = await this.model.findOne({ name });
    if (!image) {
      throw new NotFoundException(`Image named ${name} is not found`);
    }
    return image;
  }

  async update(dto: ImageInput): Promise<ImageType> {
    const image = await this.model.findOne({ name: dto.name });
    if (!image) {
      throw new NotFoundException(`Image named ${dto.name} is not found`);
    }
    const newImage = this.model.findOneAndUpdate(
      { name: dto.name },
      { data: dto.data },
    );
    return await newImage;
  }
}
