import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './types/jwt-payload.type';

function formatCpf(cpf: string): string {
  const n = cpf.replace(/\D/g, '');
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

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

  logout() {
    return { success: true, message: 'Logout efetuado com sucesso' };
  }

  async resetPassword(dto: { username: string; currentPassword: string; newPassword: string }) {
    const user = await this.prisma.users.findFirst({
      where: { OR: [{ nome: dto.username }, { email: dto.username }] },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const match = await bcrypt.compare(dto.currentPassword, user.password);
    if (!match) throw new UnauthorizedException('Senha atual incorreta');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.users.update({ where: { id: user.id }, data: { password: hashed } });

    return { success: true, message: 'Senha redefinida com sucesso' };
  }

  async verifyUsername(username: string) {
    const user = await this.prisma.users.findFirst({
      where: { OR: [{ nome: username }, { email: username }] },
      select: { id: true },
    });
    return { exists: !!user, userId: user?.id ?? null };
  }

  async register(dto: {
    nome: string;
    sobrenome: string;
    email: string;
    cpf: string;
    password: string;
  }) {
    const [emailExiste, cpfExiste] = await Promise.all([
      this.prisma.users.findUnique({ where: { email: dto.email }, select: { id: true } }),
      this.prisma.users.findUnique({ where: { cpf: formatCpf(dto.cpf) }, select: { id: true } }),
    ]);

    if (emailExiste) throw new ConflictException('E-mail já cadastrado');
    if (cpfExiste) throw new ConflictException('CPF já cadastrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.users.create({
      data: {
        id: randomUUID(),
        nome: dto.nome,
        sobrenome: dto.sobrenome,
        email: dto.email,
        cpf: formatCpf(dto.cpf),
        password: passwordHash,
        role: 'USER',
        updatedAt: new Date(),
      },
    });

    return {
      token: this.signToken(user),
      user: { id: user.id, nome: user.nome, sobrenome: user.sobrenome, email: user.email, role: user.role },
    };
  }

  async refreshPermissions(userId: string) {
    const user = await this.prisma.users.findUniqueOrThrow({ where: { id: userId } });
    return {
      success: true,
      token: this.signToken(user),
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
    };
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
