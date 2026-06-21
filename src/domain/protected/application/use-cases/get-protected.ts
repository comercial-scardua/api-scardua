import { Injectable } from '@nestjs/common'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { type Either, right } from '../../../../core/either'

export interface GetProtectedResponse {
  userId: string
  role: string
  message: string
}

type GetProtectedUseCaseResponse = Either<null, GetProtectedResponse>

@Injectable()
export class GetProtectedUseCase {
  async execute(user: JwtPayload): Promise<GetProtectedUseCaseResponse> {
    return right({
      userId: user.userId,
      role: user.role,
      message: 'Autenticado com sucesso',
    })
  }
}
