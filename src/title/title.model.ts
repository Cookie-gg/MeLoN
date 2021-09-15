import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@ObjectType()
export class TitleObject {
  @Field(() => ID)
  id: string;
  @Field()
  readonly text: string;
  @Field()
  readonly page: string;
  @Field()
  readonly section: string;
  @Field({ nullable: true })
  readonly icon?: string;
}

@InputType()
export class TitleInput {
  @Field()
  readonly text: string;
  @Field()
  readonly page: string;
  @Field()
  readonly section: string;
  @Field({ nullable: true })
  readonly icon?: string;
}

export interface TitleType extends Document {
  readonly text: string;
  readonly page: string;
  readonly section: string;
  readonly icon?: string;
}
