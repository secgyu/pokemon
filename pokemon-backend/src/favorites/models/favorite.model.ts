import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class FavoriteModel {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  pokemonId: number;

  @Field()
  createdAt: Date;
}
