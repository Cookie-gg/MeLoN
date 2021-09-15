import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TitleInput, TitleType } from './title.model';

@Injectable()
export class TitleService {
  constructor(@InjectModel('title') private readonly model: Model<TitleType>) {}

  async create(dto: TitleInput): Promise<TitleType> {
    const title = await this.model.findOne({
      page: dto.page,
      section: dto.section,
    });
    if (title) {
      throw new NotFoundException(`Title must be only one per section`);
    }
    const newTitle = new this.model(dto);
    return await newTitle.save();
  }

  async find(page: string): Promise<TitleType[]> {
    const titles = await this.model.find({ page });
    if (!titles) {
      throw new NotFoundException(`Titles of ${page} is not found.`);
    }
    return titles;
  }

  async update(dto: TitleInput): Promise<TitleType> {
    const title = await this.model.findOne({
      page: dto.page,
      section: dto.section,
    });
    if (title) {
      throw new NotFoundException(
        `Title of ${dto.page}/${dto.section} is not found.`,
      );
    }
    return this.model.findOneAndUpdate(
      { page: dto.page, section: dto.section },
      { text: dto.text },
    );
  }
}
