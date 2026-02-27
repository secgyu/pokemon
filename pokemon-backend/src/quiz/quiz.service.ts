import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveScoreInput } from './dto/save-score.input';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  saveScore(userId: string, input: SaveScoreInput) {
    return this.prisma.quizScore.create({
      data: { userId, score: input.score, totalQuestions: input.totalQuestions },
      include: { user: true },
    });
  }

  myScores(userId: string) {
    return this.prisma.quizScore.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  async rankings(limit = 10) {
    const results = await this.prisma.quizScore.groupBy({
      by: ['userId'],
      _max: { score: true },
      _count: { id: true },
      orderBy: { _max: { score: 'desc' } },
      take: limit,
    });

    const userIds = results.map((r) => r.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    return results.map((r, i) => ({
      rank: i + 1,
      nickname: userMap.get(r.userId)?.nickname ?? 'Unknown',
      bestScore: r._max.score ?? 0,
      totalGames: r._count.id,
    }));
  }
}
