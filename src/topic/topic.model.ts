import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ArticleObject, ArticleType } from 'article/article.model';

@ObjectType()
export class TopicObject {
  @Field(() => ID)
  id: string;
  @Field()
  readonly name: string;
  @Field()
  readonly displayName: string;
  @Field()
  readonly icon: string;
  @Field(() => [ArticleObject])
  readonly someArticles: ArticleObject[];
  @Field(() => [ArticleObject])
  readonly allArticles: ArticleObject[];
}

@InputType()
export class TopicInput {
  @Field()
  readonly name: string;
  @Field()
  readonly displayName: string;
  @Field()
  readonly icon: string;
}

export interface TopicType {
  readonly name: string;
  readonly displayName: string;
  readonly icon: string;
  readonly someArticles: ArticleType[];
  readonly allArticles: ArticleType[];
}
