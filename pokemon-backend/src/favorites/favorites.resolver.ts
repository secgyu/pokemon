import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { FavoriteModel } from './models/favorite.model';
import type { User } from '@prisma/client';

@Resolver()
export class FavoritesResolver {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Mutation(() => FavoriteModel)
  @UseGuards(GqlAuthGuard)
  addFavorite(
    @CurrentUser() user: User,
    @Args('pokemonId', { type: () => Int }) pokemonId: number,
  ) {
    return this.favoritesService.add(user.id, pokemonId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeFavorite(
    @CurrentUser() user: User,
    @Args('pokemonId', { type: () => Int }) pokemonId: number,
  ) {
    return this.favoritesService.remove(user.id, pokemonId);
  }

  @Query(() => [FavoriteModel])
  @UseGuards(GqlAuthGuard)
  myFavorites(@CurrentUser() user: User) {
    return this.favoritesService.findAllByUser(user.id);
  }
}
