import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { TopicObject, TopicType } from 'src/topic/topic.model';

@ObjectType()
export class ArticleObject {
  @Field(() => ID)
  id: string;
  @Field()
  readonly articleId: string;
  @Field()
  readonly published: boolean;
  @Field(() => Date)
  readonly releaseDate: Date;
  @Field(() => Date)
  readonly updateDate: Date;
  @Field()
  readonly title: string;
  @Field()
  readonly emoji: string;
  @Field()
  readonly type: 'tech' | 'idea';
  @Field(() => [String])
  readonly topics: string[];
  @Field(() => TopicObject)
  readonly typeIcon: TopicObject;
  @Field(() => [TopicObject])
  readonly topicIcons: TopicObject[];
  @Field(() => [TopicObject])
  readonly allTopics: TopicObject[];
  @Field()
  readonly markdown: string;
  @Field()
  readonly html: string;
  @Field(() => [ArticleObject])
  readonly relations: ArticleObject[];
}

@InputType()
export class ArticleInput {
  @Field()
  readonly articleId: string;
  @Field()
  readonly published: boolean;
  @Field(() => Date)
  readonly releaseDate: Date;
  @Field(() => Date)
  readonly updateDate: Date;
  @Field()
  readonly title: string;
  @Field()
  readonly emoji: string;
  @Field()
  readonly type: 'tech' | 'idea';
  @Field(() => [String])
  readonly topics: string[];
  @Field()
  readonly markdown: string;
  @Field()
  readonly html: string;
}

export interface ArticleType {
  readonly articleId: string;
  readonly published: boolean;
  readonly releaseDate: Date;
  readonly updateDate: Date;
  readonly title: string;
  readonly emoji: string;
  readonly type: 'tech' | 'idea';
  readonly topics: string[];
  readonly typeIcon: TopicType;
  readonly topicIcons: TopicType[];
  readonly markdown: string;
  readonly html: string;
  readonly relations: ArticleType[];
}
