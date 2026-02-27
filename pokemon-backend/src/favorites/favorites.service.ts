import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async add(userId: string, pokemonId: number) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_pokemonId: { userId, pokemonId } },
    });
    if (existing) throw new ConflictException('이미 즐겨찾기에 추가되어 있습니다');

    return this.prisma.favorite.create({
      data: { userId, pokemonId },
    });
  }

  async remove(userId: string, pokemonId: number) {
    await this.prisma.favorite.delete({
      where: { userId_pokemonId: { userId, pokemonId } },
    });
    return true;
  }

  findAllByUser(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
