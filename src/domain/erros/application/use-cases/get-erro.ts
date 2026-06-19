import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type ErroComArquivos,
  ErrosRepository,
} from '../repositories/erros-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetErroUseCaseRequest {
  erroId: number
}

type GetErroUseCaseResponse = Either<
  ResourceNotFoundError,
  { erro: ErroComArquivos }
>

@Injectable()
export class GetErroUseCase {
  constructor(private errosRepository: ErrosRepository) {}

  async execute({
    erroId,
  }: GetErroUseCaseRequest): Promise<GetErroUseCaseResponse> {
    const erro = await this.errosRepository.findById(erroId)

    if (!erro) {
      return left(new ResourceNotFoundError())
    }

    return right({ erro })
  }
}
