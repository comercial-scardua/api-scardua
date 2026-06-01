import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { PrismaService } from '../prisma/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      token: this.signToken(user),
      user: {
        id: user.id,
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
        cpf: user.cpf,
        role: user.role,
        foto: user.foto,
      },
    };
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.users.findUniqueOrThrow({
      where: { id: userId },
    });
    return { success: true, token: this.signToken(user) };
  }

  async verifyPassword(userId: string, password: string) {
    const user = await this.prisma.users.findUniqueOrThrow({
      where: { id: userId },
    });
    const verified = await bcrypt.compare(password, user.password);
    return { verified };
  }

  private signToken(user: { id: string; email: string; role: string }) {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwt.sign(payload);
  }
}
