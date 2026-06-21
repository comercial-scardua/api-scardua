import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { SuporteRepository } from '../repositories/suporte-repository'

type ListarUltimosEventosResponse = Either<never, { eventos: any[] }>

@Injectable()
export class ListarUltimosEventosUseCase {
  constructor(private repo: SuporteRepository) {}

  async execute(): Promise<ListarUltimosEventosResponse> {
    const eventos = await this.repo.findUltimosEventos()
    return right({ eventos })
  }
}
