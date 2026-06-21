import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type CriarManualData,
  ManuaisRepository,
  type ManualCompleto,
} from '../repositories/manuais-repository'

interface CriarManualUseCaseRequest {
  data: CriarManualData
  usuarioNome: string
}

type CriarManualUseCaseResponse = Either<null, { manual: ManualCompleto }>

@Injectable()
export class CriarManualUseCase {
  constructor(private manuaisRepository: ManuaisRepository) {}

  async execute({
    data,
    usuarioNome,
  }: CriarManualUseCaseRequest): Promise<CriarManualUseCaseResponse> {
    const manual = await this.manuaisRepository.create(data, usuarioNome)
    return right({ manual })
  }
}
