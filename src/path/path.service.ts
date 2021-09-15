import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PathInput, PathType } from './path.model';

@Injectable()
export class PathService {
  constructor(@InjectModel('path') private readonly model: Model<PathType>) {}

  async create(dto: PathInput): Promise<PathType> {
    const path = await this.model.find({ name: dto.name, path: dto.path });
    if (path.length > 0) {
      throw new NotFoundException(
        'Do not set a same name path with a same path',
      );
    } else {
      const newPath = new this.model(dto);
      return await newPath.save();
    }
  }

  async find(name: string): Promise<PathType> {
    const path = await this.model.findOne({ name });
    if (!path) {
      throw new NotFoundException(`A path named ${name} is not found.`);
    }
    return path;
  }

  async findAll(): Promise<PathType[]> {
    const path = await this.model.find();
    if (!path) {
      throw new NotFoundException(`There are not paths.`);
    }
    return path;
  }

  async findByOrder(order: number): Promise<PathType> {
    const path = await this.model.findOne({ order });
    if (!path) {
      throw new NotFoundException(`A path has order-${order} is not found.`);
    }
    return path;
  }

  async update(name: string, newDto: PathInput): Promise<PathType> {
    const path = await this.model.findOne({ name: name });
    if (!path) {
      throw new NotFoundException(`A path named ${name} is not found.`);
    }
    return await this.model.findOneAndUpdate({ name: name }, { newDto });
  }
}
