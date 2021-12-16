import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ArticleObject } from 'src/article/article.model';
import { ArticleService } from 'src/article/article.service';
import { TopicInput, TopicObject } from './topic.model';
import { TopicService } from './topic.service';

@Resolver(() => TopicObject)
export class TopicResolver {
  constructor(
    private readonly topicService: TopicService,
    private readonly articleService: ArticleService,
  ) {}

  @Mutation(() => TopicObject)
  async addTopic(@Args('args') args: TopicInput) {
    return this.topicService.create(args);
  }

  @Query(() => TopicObject)
  async findTopic(@Args('name') name: string) {
    return this.topicService.findOne(name);
  }

  @Query(() => [TopicObject])
  async findAllTopics() {
    return this.topicService.findAll();
  }

  @ResolveField(() => [ArticleObject])
  async someArticles(@Parent() topic: TopicObject) {
    return this.articleService.findByTopic(topic.name, true);
  }

  @ResolveField(() => [ArticleObject])
  async allArticles(@Parent() topic: TopicObject) {
    return this.articleService.findByTopic(topic.name);
  }

  @Mutation(() => TopicObject)
  async updateTopic(@Args('args') args: TopicInput) {
    return this.topicService.update(args);
  }
}
