import { Document } from 'mongoose';
import { IsString, IsDate } from 'class-validator';

export class AuthTokenInput {
  @IsString()
  readonly authToken!: string;
  @IsDate()
  readonly savedTime!: string;
  // @MinLength(8)
  // @MaxLength(20)
  // readonly password!: string;
}

export interface AuthTokenType extends Document {
  readonly authToken: string;
  readonly savedTime: Date;
}
