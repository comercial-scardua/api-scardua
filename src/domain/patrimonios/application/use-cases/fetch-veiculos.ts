import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PatrimoniosRepository } from '../repositories/patrimonios-repository'

type Veiculo = { id: number; nome: string; modelo: string; placa: string }

type FetchVeiculosUseCaseResponse = Either<null, { veiculos: Veiculo[] }>

@Injectable()
export class FetchVeiculosUseCase {
  constructor(private patrimoniosRepository: PatrimoniosRepository) {}

  async execute(): Promise<FetchVeiculosUseCaseResponse> {
    const veiculos = await this.patrimoniosRepository.findVeiculos()
    return right({ veiculos })
  }
}
