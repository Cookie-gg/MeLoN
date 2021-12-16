import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopicInput, TopicType } from './topic.model';

@Injectable()
export class TopicService {
  constructor(@InjectModel('topic') private readonly model: Model<TopicType>) {}

  // creat one topic
  async create(dto: TopicInput): Promise<TopicType> {
    const topic = await this.model.findOne({ name: dto.name });
    if (topic)
      throw new NotFoundException(`There is already ${dto.name} topic.`);
    return await new this.model(dto).save();
  }

  // find one topic
  async findOne(name: string): Promise<TopicType> {
    const topic = await this.model.findOne({ name });
    if (!topic) throw new NotFoundException(`${name} topic is not found.`);
    return topic;
  }

  // find all topics
  async findAll(): Promise<TopicType[]> {
    const all = await this.model.find();
    return all.filter(
      (topic) => topic.name !== 'tech' && topic.name !== 'idea',
    );
  }

  // update one topic
  async update(dto: TopicInput): Promise<TopicType> {
    const topic = await this.model.findOne({ name: dto.name });
    if (!topic) throw new NotFoundException(`${dto.name} topic is not found.`);
    return await this.model.findOneAndUpdate(
      { name: dto.name },
      { displayName: dto.displayName, icon: dto.icon },
    );
  }
}
