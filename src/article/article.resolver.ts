import {
  Args,
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
    return this.articleService.change(id, args);
  }

  @Query(() => ArticleObject)
  async findArticle(@Args('articleId') articleId: string) {
    return this.articleService.findByArticleId(articleId);
  }

  @Query(() => [ArticleObject])
  async findAllArticles() {
    return this.articleService.findAll();
  }

  @ResolveField(() => TopicObject)
  async typeIcon(@Parent() article: ArticleObject) {
    const type = await this.topicService.find(article.type);
    return type;
  }

  @ResolveField(() => [TopicObject])
  async topicIcons(@Parent() article: ArticleObject) {
    const topics = article.topics.map(
      async (el) => await this.topicService.find(el.toLowerCase()),
    );
    return topics;
  }

  @ResolveField(() => [ArticleObject])
  async relations(@Parent() article: ArticleObject) {
    return this.articleService.findRelations(article.id, article.topics);
  }

  @Mutation(() => ArticleObject)
  async deleteArticle(@Args('id') id: string) {
    return this.articleService.delete(id);
  }
}
