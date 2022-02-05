import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { releaseSort, topicSort } from 'src/common';
import { ArticleInput, ArticleType } from './article.model';

@Injectable()
export class ArticleService {
  constructor(@InjectModel('article') private readonly model: Model<ArticleType>) {}

  // create and update
  async change(id: string, dto: ArticleInput): Promise<ArticleType> {
    // update
    if (id !== '') {
      const article = await this.model.findById(id);
      if (article) return await this.model.findByIdAndUpdate(id, dto);
    }
    // create
    else return await new this.model(dto).save();
  }

  // find one by article id
  async findOne(articleId: string): Promise<ArticleType> {
    const article = topicSort(await this.model.findOne({ articleId }));
    if (!article) {
      throw new NotFoundException(`A article has id:${articleId} is not found.`);
    }
    return article;
  }

  // find all
  async findAll(): Promise<ArticleType[]> {
    const all = releaseSort(await this.model.find()).map((el) => topicSort(el));
    if (!all) throw new NotFoundException(`There is no articles.`);
    return all;
  }

  // find more
  async findMore(current: number): Promise<ArticleType[]> {
    const all = releaseSort(await this.model.find()).map((el) => topicSort(el));
    return all.slice(current, current + 4);
  }

  // count all
  async countAll(): Promise<number> {
    return (await this.model.find()).length;
  }

  // find relations by topics one article has
  async findRelations(id: string, topics: string[]): Promise<ArticleType[]> {
    const all = releaseSort(await this.model.find()).map((el) => topicSort(el));
    if (!all) throw new NotFoundException(`There is no articles.`);
    const relations: ArticleType[] = []; // variable to be pushed relation articles
    all.forEach((article) => {
      for (let i = 0; i < topics.length; i++) {
        if (article.topics.some((topic) => topic === topics[i])) {
          if (article.id === id) break; // in case of an article which has already pushed
          relations.push(article);
          break;
        }
      }
    });
    return relations.slice(0, 4);
  }

  // find by one topic
  async findByTopic(target: string, isSome?: boolean): Promise<ArticleType[]> {
    const all = releaseSort(await this.model.find());
    if (!all) {
      throw new NotFoundException(`There is no articles.`);
    }
    const targets: ArticleType[] = [];
    if (target === 'tech' || target === 'idea') {
      all.forEach((article) => article.type === target && targets.push(article));
    } else {
      all.forEach((article) => article.topics.some((topic) => topic === target) && targets.push(article));
    }
    return isSome ? targets.slice(0, 3) : targets;
  }

  // delete one
  async delete(id: string): Promise<ArticleType> {
    const article = await this.model.findById(id);
    if (!article) throw new NotFoundException(`A article has id:${id} is not found.`);
    return await this.model.findByIdAndDelete(id);
  }
}
