import { Injectable } from '@nestjs/common'
import type { epi_cargos } from '@prisma/client'
import { type Either, left, right } from '../../../core/either'
import type { AtualizarCargoEpiDto } from '../dto/atualizar-cargo-epi.dto'
import { EpiRepository } from '../repositories/epi.repository'
import { CargoNaoEncontradoError } from './errors/cargo-nao-encontrado.error'

type Result = Either<CargoNaoEncontradoError, { cargo: epi_cargos }>

@Injectable()
export class AtualizarCargoEpiUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(id: number, dto: AtualizarCargoEpiDto): Promise<Result> {
    const existe = await this.repo.findCargoById(id)
    if (!existe) return left(new CargoNaoEncontradoError(id))

    const cargo = await this.repo.updateCargo(id, dto)
    return right({ cargo })
  }
}
