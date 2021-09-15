import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@ObjectType()
class ListBodyObject {
  @Field()
  readonly title: string;
  @Field({ nullable: true })
  readonly icon?: string;
}

@InputType()
class ListBodyInput {
  @Field()
  readonly title: string;
  @Field({ nullable: true })
  readonly icon?: string;
}

@ObjectType()
export class ListObject {
  @Field(() => ID)
  id: string;
  @Field(() => [ListBodyObject])
  readonly list: ListBodyObject[];
  @Field()
  readonly name: string;
  @Field()
  readonly section: string;
}

@InputType()
export class ListInput {
  @Field(() => [ListBodyInput])
  readonly list: ListBodyInput[];
  @Field()
  readonly name: string;
  @Field()
  readonly section: string;
}

export interface ListType extends Document {
  readonly list: {
    readonly title: string;
    readonly icon?: string;
  }[];
  readonly name: string;
  readonly section: string;
}
