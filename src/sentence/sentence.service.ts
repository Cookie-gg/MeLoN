import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SentenceInput, SentenceType } from './sentence.model';

@Injectable()
export class SentenceService {
  constructor(
    @InjectModel('sentence') private readonly model: Model<SentenceType>,
  ) {}

  async create(dto: SentenceInput): Promise<SentenceType> {
    const sentence = await this.model.findOne({
      page: dto.page,
      section: dto.section,
    });
    if (sentence) {
      throw new NotFoundException(
        `Sentence must be only one object per section`,
      );
    }
    const newSentence = new this.model(dto);
    return await newSentence.save();
  }

  async find(page: string): Promise<SentenceType[]> {
    const sentences = await this.model.find({ page });
    if (!sentences) {
      throw new NotFoundException(`Sentences of ${page} is not found.`);
    }
    return sentences;
  }

  async update(dto: SentenceInput): Promise<SentenceType> {
    const sentence = await this.model.findOne({
      page: dto.page,
      section: dto.section,
    });
    if (!sentence) {
      throw new NotFoundException(
        `Sentence of ${dto.page}/${dto.section} is not found.`,
      );
    }
    return await this.model.findOneAndUpdate(
      { page: dto.page, section: dto.section },
      { text: dto.text },
    );
  }
}
