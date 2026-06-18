import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../core/either'
import { PrismaService } from '../../../prisma/prisma.service'
import type { AtualizarPatrimonioDto } from '../dto/atualizar-patrimonio.dto'
import { PatrimoniosRepository } from '../repositories/patrimonios.repository'
import { PatrimonioNaoEncontradoError } from './errors/patrimonio-nao-encontrado.error'

type AtualizarResult = Either<PatrimonioNaoEncontradoError, { id: number }>

@Injectable()
export class AtualizarPatrimonioUseCase {
  constructor(
    private repo: PatrimoniosRepository,
    private prisma: PrismaService,
  ) {}

  async execute(
    id: number,
    dto: AtualizarPatrimonioDto,
    userId: string,
  ): Promise<AtualizarResult> {
    const colaborador = await this.prisma.colaboradores.findFirst({
      where: { userId },
      select: { id: true },
    })
    const autorColaboradorId = colaborador?.id ?? null
    const atual = await this.repo.findById(id)
    if (!atual) return left(new PatrimonioNaoEncontradoError(id))

    await this.repo.update(id, dto)

    // Detecta mudanças e cria movimentações automaticamente
    const mudouResponsavel =
      dto.responsavelId !== undefined &&
      dto.responsavelId !== atual.responsavelId
    const mudouLocalizacao =
      dto.localizacao !== undefined && dto.localizacao !== atual.localizacao
    const mudouKm =
      atual.tipo === 'Veículo' &&
      dto.kmEntrega !== undefined &&
      dto.kmEntrega !== atual.kmEntrega

    try {
      if (mudouResponsavel) {
        await this.repo.criarMovimentacao({
          patrimonioId: id,
          tipo: 'ALTERACAO_RESPONSAVEL',
          autorId: autorColaboradorId ?? null,
          responsavelAnteriorId: atual.responsavelId,
          responsavelNovoId: dto.responsavelId ?? null,
          localizacaoAnterior: atual.localizacao,
          localizacaoNova: dto.localizacao ?? atual.localizacao,
        })
      }

      if (mudouLocalizacao) {
        await this.repo.criarMovimentacao({
          patrimonioId: id,
          tipo: 'ALTERACAO_LOCALIZACAO',
          autorId: autorColaboradorId ?? null,
          responsavelAnteriorId: atual.responsavelId,
          responsavelNovoId: dto.responsavelId ?? atual.responsavelId,
          localizacaoAnterior: atual.localizacao,
          localizacaoNova: dto.localizacao ?? null,
        })
      }

      if (mudouKm) {
        await this.repo.criarMovimentacao({
          patrimonioId: id,
          tipo: 'ALTERACAO_KM',
          autorId: autorColaboradorId ?? null,
          responsavelAnteriorId: atual.responsavelId,
          responsavelNovoId: dto.responsavelId ?? atual.responsavelId,
          kmAnterior: atual.kmEntrega,
          kmNovo: dto.kmEntrega ?? null,
        })
      }
    } catch {
      // Falha na movimentação não reverte a atualização (igual ao portal)
    }

    return right({ id })
  }
}
