import { Injectable } from '@nestjs/common'
import type { relatorios } from '@prisma/client'
import { type Either, right } from '../../../../core/either'
import {
  type CreateRelatorioData,
  RelatoriosRepository,
} from '../repositories/relatorios-repository'

type CreateRelatorioUseCaseResponse = Either<null, { relatorio: relatorios }>

@Injectable()
export class CreateRelatorioUseCase {
  constructor(private relatoriosRepository: RelatoriosRepository) {}

  async execute(
    data: CreateRelatorioData,
  ): Promise<CreateRelatorioUseCaseResponse> {
    const relatorio = await this.relatoriosRepository.create(data)
    return right({ relatorio })
  }
}
