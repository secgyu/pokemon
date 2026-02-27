import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(input: SignupInput) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { nickname: input.nickname }] },
    });
    if (existing) {
      const field = existing.email === input.email ? '이메일' : '닉네임';
      throw new ConflictException(`이미 사용 중인 ${field}입니다`);
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: { email: input.email, nickname: input.nickname, passwordHash },
    });

    return {
      accessToken: this.createToken(user.id, user.email),
      user,
    };
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다');

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다');

    return {
      accessToken: this.createToken(user.id, user.email),
      user,
    };
  }

  private createToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
