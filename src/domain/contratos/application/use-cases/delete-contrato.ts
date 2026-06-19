import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../../../../common/supabase/supabase.service'
import { type Either, left, right } from '../../../../core/either'
import { ContratosRepository } from '../repositories/contratos-repository'
import { ContratoNaoEncontradoError } from './errors/contrato-nao-encontrado.error'

interface DeleteContratoUseCaseRequest {
  contratoId: number
}

type DeleteContratoUseCaseResponse = Either<ContratoNaoEncontradoError, null>

@Injectable()
export class DeleteContratoUseCase {
  constructor(
    private contratosRepository: ContratosRepository,
    private supabase: SupabaseService,
  ) {}

  async execute({
    contratoId,
  }: DeleteContratoUseCaseRequest): Promise<DeleteContratoUseCaseResponse> {
    const contrato = await this.contratosRepository.findById(contratoId)
    if (!contrato) return left(new ContratoNaoEncontradoError(contratoId))

    // Remove arquivos do Supabase (falhas ignoradas — contrato é excluído mesmo assim).
    for (const arquivo of contrato.arquivos) {
      const path = this.supabase.extractPathFromUrl(
        arquivo.caminho_arquivo,
        'uploads',
      )
      if (path) {
        await this.supabase.remove('uploads', [path]).catch(() => null)
      }
    }

    await this.contratosRepository.excluir(contratoId)
    return right(null)
  }
}
