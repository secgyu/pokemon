import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class TeamModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [Int])
  pokemonIds: number[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
