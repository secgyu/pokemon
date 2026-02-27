import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RankingEntry {
  @Field(() => Int)
  rank: number;

  @Field()
  nickname: string;

  @Field(() => Int)
  bestScore: number;

  @Field(() => Int)
  totalGames: number;
}
