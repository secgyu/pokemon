import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, input: CreateTeamInput) {
    return this.prisma.team.create({
      data: { userId, name: input.name, pokemonIds: input.pokemonIds },
    });
  }

  findAllByUser(userId: string) {
    return this.prisma.team.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) throw new NotFoundException('팀을 찾을 수 없습니다');
    if (team.userId !== userId) throw new ForbiddenException('접근 권한이 없습니다');
    return team;
  }

  async update(id: string, userId: string, input: UpdateTeamInput) {
    await this.findOne(id, userId);
    return this.prisma.team.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.pokemonIds !== undefined && { pokemonIds: input.pokemonIds }),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.team.delete({ where: { id } });
    return true;
  }
}
