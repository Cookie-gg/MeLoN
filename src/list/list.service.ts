import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListInput, ListType } from './list.model';

@Injectable()
export class ListService {
  constructor(@InjectModel('list') private readonly model: Model<ListType>) {}

  async create(dto: ListInput): Promise<ListType> {
    const list = await this.model.findOne({
      section: dto.section,
      name: dto.name,
    });
    if (list) {
      throw new NotFoundException('You can not post data with used list name');
    }
    const createdList = new this.model(dto);
    return await createdList.save();
  }

  async find(name: string, section: string): Promise<ListType> {
    const list = await this.model.findOne({ name, section });
    if (!list) {
      throw new NotFoundException(`List of ${name} is not found`);
    }
    return list;
  }

  async findBySection(section: string): Promise<ListType[]> {
    const list = await this.model.find({ section });
    if (list.length === 0) {
      throw new NotFoundException(`List of ${section} is not found`);
    }
    return list;
  }

  async update(dto: ListInput): Promise<ListType> {
    const list = await this.model.findOne({ name: dto.name });
    if (!list) {
      throw new NotFoundException(`List of ${dto.name} is not found`);
    }
    return await this.model.findOneAndUpdate(
      { name: dto.name },
      { list: dto.list },
    );
  }
}
