import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SaveScoreInput } from './dto/save-score.input';
import { QuizScoreModel } from './models/quiz-score.model';
import { RankingEntry } from './models/ranking-entry.model';
import type { User } from '@prisma/client';

@Resolver()
export class QuizResolver {
  constructor(private readonly quizService: QuizService) {}

  @Mutation(() => QuizScoreModel)
  @UseGuards(GqlAuthGuard)
  saveQuizScore(
    @CurrentUser() user: User,
    @Args('input') input: SaveScoreInput,
  ) {
    return this.quizService.saveScore(user.id, input);
  }

  @Query(() => [QuizScoreModel])
  @UseGuards(GqlAuthGuard)
  myQuizScores(@CurrentUser() user: User) {
    return this.quizService.myScores(user.id);
  }

  @Query(() => [RankingEntry])
  quizRankings(@Args('limit', { type: () => Int, defaultValue: 10 }) limit: number) {
    return this.quizService.rankings(limit);
  }
}
