import { Injectable } from '@nestjs/common'
import type { colaboradores } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { SupabaseService } from '../../../../common/supabase/supabase.service'
import { type Either, left, right } from '../../../../core/either'
import { ColaboradoresRepository } from '../repositories/colaboradores-repository'
import { ColaboradorNaoEncontradoError } from './errors/colaborador-nao-encontrado.error'

interface UpdateFotoColaboradorUseCaseRequest {
  colaboradorId: number
  file: Express.Multer.File
}

type UpdateFotoColaboradorUseCaseResponse = Either<
  ColaboradorNaoEncontradoError,
  { colaborador: colaboradores; fotoUrl: string }
>

@Injectable()
export class UpdateFotoColaboradorUseCase {
  constructor(
    private colaboradoresRepository: ColaboradoresRepository,
    private supabase: SupabaseService,
  ) {}

  async execute({
    colaboradorId,
    file,
  }: UpdateFotoColaboradorUseCaseRequest): Promise<UpdateFotoColaboradorUseCaseResponse> {
    const existe = await this.colaboradoresRepository.findById(colaboradorId)
    if (!existe) return left(new ColaboradorNaoEncontradoError(colaboradorId))

    const ext = extname(file.originalname)
    const path = `colaboradores/foto_${colaboradorId}_${randomUUID().slice(0, 8)}${ext}`
    const fotoUrl = await this.supabase.upload(
      'uploads',
      path,
      file.buffer,
      file.mimetype,
    )

    const colaborador = await this.colaboradoresRepository.updateFoto(
      colaboradorId,
      fotoUrl,
    )
    return right({ colaborador, fotoUrl })
  }
}
