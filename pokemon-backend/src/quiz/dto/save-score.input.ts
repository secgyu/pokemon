import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min, Max } from 'class-validator';

@InputType()
export class SaveScoreInput {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  score: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(100)
  totalQuestions: number;
}
