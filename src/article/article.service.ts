import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { releaseSort } from 'src/common';
import { ArticleInput, ArticleType } from './article.model';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('article') private readonly model: Model<ArticleType>,
  ) {}

  async create(dto: ArticleInput): Promise<ArticleType> {
    const article = await this.model.findOne({ title: dto.title });
    if (article) {
      throw new NotFoundException(`Do not post used title.`);
    } else {
      const newArticle = new this.model(dto);
      return await newArticle.save();
    }
  }

  async find(latest: boolean): Promise<ArticleType[]> {
    const articles = releaseSort(await this.model.find());
    if (!articles) {
      throw new NotFoundException(`There is no articles.`);
    }
    if (latest) {
      return articles.slice(0, 4);
    } else {
      return articles.slice(4);
    }
  }

  async findAll(): Promise<ArticleType[]> {
    const articles = await this.model.find();
    if (!articles) {
      throw new NotFoundException(`There is no articles.`);
    }
    return articles;
  }

  async findRelations(id: string, topics: string[]): Promise<ArticleType[]> {
    const articles = releaseSort(await this.model.find()); // get all articles
    if (!articles) {
      throw new NotFoundException(`There is no articles.`); // non null check
    }
    const relations: ArticleType[] = []; // variable to be pushed relation articles
    articles.forEach((article) => {
      for (let i = 0; i < topics.length; i++) {
        if (article.topics.some((topic) => topic === topics[i])) {
          if (article.id === id) break;
          relations.push(article);
          break;
        }
      }
    });
    return relations.slice(0, relations.length >= 4 ? 4 : 2);
  }

  async findByTopic(
    targetTopic: string,
    isSome?: boolean,
  ): Promise<ArticleType[]> {
    const articles = releaseSort(await this.model.find());
    if (!articles) {
      throw new NotFoundException(`There is no articles.`);
    }
    const targetArticles: ArticleType[] = [];
    if (targetTopic === 'tech' || targetTopic === 'idea') {
      articles.forEach((article) => {
        if (article.type === targetTopic) {
          targetArticles.push(article);
        }
      });
    } else {
      articles.forEach((article) => {
        if (article.topics.some((topic) => topic === targetTopic))
          targetArticles.push(article);
      });
    }
    if (isSome) {
      return targetArticles.slice(0, 3);
    } else {
      return targetArticles;
    }
  }

  async update(id: string, dto: ArticleInput): Promise<ArticleType> {
    const article = await this.model.findById(id);
    if (!article) {
      throw new NotFoundException(`A article has id:${id} is not found.`);
    } else return await this.model.findByIdAndUpdate(id, dto);
  }
}
