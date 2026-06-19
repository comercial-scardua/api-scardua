import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PatrimoniosRepository } from '../repositories/patrimonios-repository'

interface CheckPatrimonioSerialUseCaseRequest {
  serial: string
  skipId?: number
}

type CheckPatrimonioSerialUseCaseResponse = Either<
  null,
  {
    exists: boolean
    patrimonio: { id: number; nome: string; tipo: string } | null
  }
>

@Injectable()
export class CheckPatrimonioSerialUseCase {
  constructor(private patrimoniosRepository: PatrimoniosRepository) {}

  async execute({
    serial,
    skipId,
  }: CheckPatrimonioSerialUseCaseRequest): Promise<CheckPatrimonioSerialUseCaseResponse> {
    const patrimonio = await this.patrimoniosRepository.findBySerial(
      serial,
      skipId,
    )
    return right({ exists: !!patrimonio, patrimonio: patrimonio ?? null })
  }
}
