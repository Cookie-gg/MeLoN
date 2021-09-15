import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SentenceObject {
  @Field(() => ID)
  id: string;
  @Field(() => [String])
  readonly text: string[];
  @Field()
  readonly page: string;
  @Field()
  readonly section: string;
}

@InputType()
export class SentenceInput {
  @Field(() => [String])
  readonly text: string[];
  @Field()
  readonly page: string;
  @Field()
  readonly section: string;
}

export interface SentenceType {
  readonly text: string[];
  readonly page: string;
  readonly section: string;
}
