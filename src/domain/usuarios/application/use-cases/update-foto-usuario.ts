import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { SupabaseService } from '../../../../common/supabase/supabase.service'
import { type Either, left, right } from '../../../../core/either'
import { UsuariosRepository } from '../repositories/usuarios-repository'
import { UsuarioNaoEncontradoError } from './errors/usuario-nao-encontrado.error'

interface UpdateFotoUsuarioUseCaseRequest {
  usuarioId: string
  file: Express.Multer.File
}

type UpdateFotoUsuarioUseCaseResponse = Either<
  UsuarioNaoEncontradoError,
  { fotoUrl: string }
>

@Injectable()
export class UpdateFotoUsuarioUseCase {
  constructor(
    private usuariosRepository: UsuariosRepository,
    private supabase: SupabaseService,
  ) {}

  async execute({
    usuarioId,
    file,
  }: UpdateFotoUsuarioUseCaseRequest): Promise<UpdateFotoUsuarioUseCaseResponse> {
    const user = await this.usuariosRepository.findById(usuarioId)
    if (!user) return left(new UsuarioNaoEncontradoError(usuarioId))

    const ext = extname(file.originalname)
    const path = `fotos/usuarios/${usuarioId}_${Date.now()}_${randomUUID().slice(0, 8)}${ext}`
    const fotoUrl = await this.supabase.upload(
      'uploads',
      path,
      file.buffer,
      file.mimetype,
    )

    await this.usuariosRepository.updateFoto(usuarioId, fotoUrl)
    return right({ fotoUrl })
  }
}
