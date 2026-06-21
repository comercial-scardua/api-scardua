import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrismaService } from '../../../../prisma/prisma.service'

interface CheckCpfRequest {
  cpf: string
}

export interface CheckCpfResponse {
  valid: boolean
  exists: boolean
  existsIn: 'users' | 'colaboradores' | null
}

type CheckCpfUseCaseResponse = Either<null, CheckCpfResponse>

function formatCpf(digits: string): string {
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

@Injectable()
export class CheckCpfUseCase {
  constructor(private prisma: PrismaService) {}

  async execute({ cpf }: CheckCpfRequest): Promise<CheckCpfUseCaseResponse> {
    const cpfDigits = cpf.replace(/\D/g, '')
    const valid = cpfDigits.length === 11

    if (!valid) {
      return right({ valid: false, exists: false, existsIn: null })
    }

    const cpfFormatado = formatCpf(cpfDigits)
    const userWithCpf = await this.prisma.users.findUnique({
      where: { cpf: cpfFormatado },
      select: { id: true },
    })

    if (userWithCpf) {
      return right({ valid: true, exists: true, existsIn: 'users' })
    }

    const colaboradorWithCpf = await this.prisma.colaboradores.findFirst({
      where: { cpf: { in: [cpfDigits, cpfFormatado] } },
      select: { id: true },
    })

    if (colaboradorWithCpf) {
      return right({ valid: true, exists: true, existsIn: 'colaboradores' })
    }

    return right({ valid: true, exists: false, existsIn: null })
  }
}
