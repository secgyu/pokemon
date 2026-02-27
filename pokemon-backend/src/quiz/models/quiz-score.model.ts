import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { UserModel } from '../../users/models/user.model';

@ObjectType()
export class QuizScoreModel {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  score: number;

  @Field(() => Int)
  totalQuestions: number;

  @Field()
  createdAt: Date;

  @Field(() => UserModel)
  user: UserModel;
}
