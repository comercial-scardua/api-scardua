import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  PatrimoniosRepository,
  type UpdatePatrimonioData,
} from '../repositories/patrimonios-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditPatrimonioUseCaseRequest {
  patrimonioId: number
  data: UpdatePatrimonioData
  userId: string
}

type EditPatrimonioUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class EditPatrimonioUseCase {
  constructor(private patrimoniosRepository: PatrimoniosRepository) {}

  async execute({
    patrimonioId,
    data,
    userId,
  }: EditPatrimonioUseCaseRequest): Promise<EditPatrimonioUseCaseResponse> {
    const autorColaboradorId =
      await this.patrimoniosRepository.findColaboradorIdByUserId(userId)

    const atual = await this.patrimoniosRepository.findById(patrimonioId)
    if (!atual) return left(new ResourceNotFoundError(patrimonioId))

    await this.patrimoniosRepository.update(patrimonioId, data)

    // Detecta mudanças e cria movimentações automaticamente.
    const mudouResponsavel =
      data.responsavelId !== undefined &&
      data.responsavelId !== atual.responsavelId
    const mudouLocalizacao =
      data.localizacao !== undefined && data.localizacao !== atual.localizacao
    const mudouKm =
      atual.tipo === 'Veículo' &&
      data.kmEntrega !== undefined &&
      data.kmEntrega !== atual.kmEntrega

    try {
      if (mudouResponsavel) {
        await this.patrimoniosRepository.criarMovimentacao({
          patrimonioId,
          tipo: 'ALTERACAO_RESPONSAVEL',
          autorId: autorColaboradorId,
          responsavelAnteriorId: atual.responsavelId,
          responsavelNovoId: data.responsavelId ?? null,
          localizacaoAnterior: atual.localizacao,
          localizacaoNova: data.localizacao ?? atual.localizacao,
        })
      }

      if (mudouLocalizacao) {
        await this.patrimoniosRepository.criarMovimentacao({
          patrimonioId,
          tipo: 'ALTERACAO_LOCALIZACAO',
          autorId: autorColaboradorId,
          responsavelAnteriorId: atual.responsavelId,
          responsavelNovoId: data.responsavelId ?? atual.responsavelId,
          localizacaoAnterior: atual.localizacao,
          localizacaoNova: data.localizacao ?? null,
        })
      }

      if (mudouKm) {
        await this.patrimoniosRepository.criarMovimentacao({
          patrimonioId,
          tipo: 'ALTERACAO_KM',
          autorId: autorColaboradorId,
          responsavelAnteriorId: atual.responsavelId,
          responsavelNovoId: data.responsavelId ?? atual.responsavelId,
          kmAnterior: atual.kmEntrega,
          kmNovo: data.kmEntrega ?? null,
        })
      }
    } catch {
      // Falha na movimentação não reverte a atualização (igual ao portal).
    }

    return right(null)
  }
}
