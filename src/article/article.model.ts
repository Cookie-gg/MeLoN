import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { TopicObject, TopicType } from 'src/topic/topic.model';

@ObjectType()
export class ArticleObject {
  @Field(() => ID)
  id: string;
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
  @Field()
  readonly body: string;
  @Field(() => [ArticleObject])
  readonly relations: ArticleObject[];
}

@InputType()
export class ArticleInput {
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
  readonly body: string;
}

export interface ArticleType {
  readonly releaseDate: Date;
  readonly updateDate: Date;
  readonly title: string;
  readonly emoji: string;
  readonly type: 'tech' | 'idea';
  readonly topics: string[];
  readonly typeIcon: TopicType;
  readonly topicIcons: TopicType[];
  readonly body: string;
  readonly relations: ArticleType[];
}
