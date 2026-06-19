import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { AniversariantesRepository } from '../repositories/aniversariantes-repository'

export type Aniversariante = {
  id: number
  nome: string
  sobrenome: string
  dataNascimento: Date
  empresa?: string
  idade: number
  diasParaAniversario: number
}

type FetchAniversariantesUseCaseResponse = Either<
  null,
  { aniversariantes: Aniversariante[] }
>

@Injectable()
export class FetchAniversariantesUseCase {
  constructor(private aniversariantesRepository: AniversariantesRepository) {}

  async execute(mes?: number): Promise<FetchAniversariantesUseCaseResponse> {
    const colaboradores =
      await this.aniversariantesRepository.findColaboradoresComNascimento()

    const hoje = new Date()
    const mesFiltro = mes ?? hoje.getMonth() + 1
    const anoAtual = hoje.getFullYear()

    const aniversariantes = colaboradores
      .filter((c) => c.dataNascimento.getMonth() + 1 === mesFiltro)
      .map((c) => {
        const nascimento = c.dataNascimento

        let proximoAniversario = new Date(
          anoAtual,
          nascimento.getMonth(),
          nascimento.getDate(),
        )
        if (proximoAniversario < hoje) {
          proximoAniversario = new Date(
            anoAtual + 1,
            nascimento.getMonth(),
            nascimento.getDate(),
          )
        }

        const diffTime = proximoAniversario.getTime() - hoje.getTime()
        const diasParaAniversario = Math.max(
          0,
          Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
        )

        return {
          id: c.id,
          nome: c.nome ?? '',
          sobrenome: c.sobrenome ?? '',
          dataNascimento: nascimento,
          empresa: c.empresa ?? undefined,
          idade: proximoAniversario.getFullYear() - nascimento.getFullYear(),
          diasParaAniversario,
        }
      })
      .sort((a, b) => a.diasParaAniversario - b.diasParaAniversario)

    return right({ aniversariantes })
  }
}
