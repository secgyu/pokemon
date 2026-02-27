import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';
import { TeamModel } from './models/team.model';
import type { User } from '@prisma/client';

@Resolver()
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Mutation(() => TeamModel)
  @UseGuards(GqlAuthGuard)
  createTeam(
    @CurrentUser() user: User,
    @Args('input') input: CreateTeamInput,
  ) {
    return this.teamsService.create(user.id, input);
  }

  @Query(() => [TeamModel])
  @UseGuards(GqlAuthGuard)
  myTeams(@CurrentUser() user: User) {
    return this.teamsService.findAllByUser(user.id);
  }

  @Query(() => TeamModel)
  @UseGuards(GqlAuthGuard)
  team(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.teamsService.findOne(id, user.id);
  }

  @Mutation(() => TeamModel)
  @UseGuards(GqlAuthGuard)
  updateTeam(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTeamInput,
  ) {
    return this.teamsService.update(id, user.id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteTeam(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.teamsService.remove(id, user.id);
  }
}
