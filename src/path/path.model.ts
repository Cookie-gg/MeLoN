import { Document } from 'mongoose';
import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PathObject {
  @Field(() => ID)
  id: string;
  @Field()
  readonly name: string;
  @Field()
  readonly path: string;
  @Field()
  readonly icon: string;
  @Field(() => Int, { nullable: true })
  readonly order?: number;
}

@InputType()
export class PathInput {
  @Field()
  readonly name: string;
  @Field()
  readonly path: string;
  @Field()
  readonly icon: string;
  @Field(() => Int, { nullable: true })
  readonly order?: number;
}

export interface PathType extends Document {
  readonly name: string;
  readonly path: string;
  readonly icon: string;
  readonly order?: number;
}
