import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TopicObject } from 'src/topic/topic.model';
import { TopicService } from 'src/topic/topic.service';
import { ArticleInput, ArticleObject } from './article.model';
import { ArticleService } from './article.service';

@Resolver(() => ArticleObject)
export class ArticleResolver {
  constructor(
    private readonly topicService: TopicService,
    private readonly articleService: ArticleService,
  ) {}

  @Mutation(() => ArticleObject)
  async changeArticle(
    @Args('id') id: string,
    @Args('args') args: ArticleInput,
  ) {
    return await this.articleService.change(id, args);
  }

  @Query(() => ArticleObject)
  async findArticle(@Args('articleId') articleId: string) {
    return await this.articleService.findOne(articleId);
  }

  @Query(() => [ArticleObject])
  async findAllArticles() {
    return await this.articleService.findAll();
  }

  @Query(() => [ArticleObject])
  async findMoreArticles(@Args('current') current: string) {
    return await this.articleService.findMore(Number(current));
  }

  @Query(() => Int)
  async countAllArticles() {
    return await this.articleService.countAll();
  }

  @ResolveField(() => TopicObject)
  async typeIcon(@Parent() article: ArticleObject) {
    return await this.topicService.findOne(article.type);
  }

  @ResolveField(() => [TopicObject])
  async topicIcons(@Parent() article: ArticleObject) {
    return article.topics.map(
      async (el) => await this.topicService.findOne(el.toLowerCase()),
    );
  }

  @ResolveField(() => [ArticleObject])
  async relations(@Parent() article: ArticleObject) {
    return await this.articleService.findRelations(article.id, article.topics);
  }

  @Mutation(() => ArticleObject)
  async deleteArticle(@Args('id') id: string) {
    return await this.articleService.delete(id);
  }
}
