import { Injectable } from '@nestjs/common';
import type { colaboradores } from '@prisma/client';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { SupabaseService } from '../../../common/supabase/supabase.service';
import { type Either, left, right } from '../../../core/either';
import { ColaboradoresRepository } from '../repositories/colaboradores.repository';
import { ColaboradorNaoEncontradoError } from './errors/colaborador-nao-encontrado.error';

type Result = Either<ColaboradorNaoEncontradoError, { colaborador: colaboradores; fotoUrl: string }>;

@Injectable()
export class AtualizarFotoColaboradorUseCase {
  constructor(
    private repo: ColaboradoresRepository,
    private supabase: SupabaseService,
  ) {}

  async execute(id: number, file: Express.Multer.File): Promise<Result> {
    const existe = await this.repo.findById(id);
    if (!existe) return left(new ColaboradorNaoEncontradoError(id));

    const ext = extname(file.originalname);
    const path = `colaboradores/foto_${id}_${randomUUID().slice(0, 8)}${ext}`;
    const fotoUrl = await this.supabase.upload('uploads', path, file.buffer, file.mimetype);

    const colaborador = await this.repo.updateFoto(id, fotoUrl);
    return right({ colaborador, fotoUrl });
  }
}
