import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { type Either, left, right } from '../../../core/either';
import type { SupabaseService } from '../../../common/supabase/supabase.service';
import type { PrismaService } from '../../../prisma/prisma.service';
import { UsuarioNaoEncontradoError } from './errors/usuario-nao-encontrado.error';

type AtualizarFotoResult = Either<UsuarioNaoEncontradoError, { fotoUrl: string }>;

@Injectable()
export class AtualizarFotoUsuarioUseCase {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  async execute(userId: string, file: Express.Multer.File): Promise<AtualizarFotoResult> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return left(new UsuarioNaoEncontradoError(userId));

    const ext = extname(file.originalname);
    const path = `fotos/usuarios/${userId}_${Date.now()}_${randomUUID().slice(0, 8)}${ext}`;
    const fotoUrl = await this.supabase.upload('uploads', path, file.buffer, file.mimetype);

    await this.prisma.users.update({
      where: { id: userId },
      data: { foto: fotoUrl, updatedAt: new Date() },
    });

    return right({ fotoUrl });
  }
}
