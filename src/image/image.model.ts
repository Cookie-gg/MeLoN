import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@ObjectType()
export class ImageObject {
  @Field(() => ID)
  id: string;
  @Field()
  readonly data: string;
  @Field()
  readonly name: string;
}

@InputType()
export class ImageInput {
  @Field()
  readonly data: string;
  @Field()
  readonly name: string;
}

export interface ImageType extends Document {
  readonly data: string;
  readonly name: string;
}
