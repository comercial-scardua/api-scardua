import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../core/either'
import type { AtualizarEmpresaDto } from '../dto/atualizar-empresa.dto'
import type { EmpresaCompleta } from '../repositories/empresas.repository'
import { EmpresasRepository } from '../repositories/empresas.repository'
import { CnpjJaCadastradoError } from './errors/cnpj-ja-cadastrado.error'
import { EmpresaNaoEncontradaError } from './errors/empresa-nao-encontrada.error'

type AtualizarEmpresaResult = Either<
  EmpresaNaoEncontradaError | CnpjJaCadastradoError,
  { empresa: EmpresaCompleta }
>

@Injectable()
export class AtualizarEmpresaUseCase {
  constructor(private repo: EmpresasRepository) {}

  async execute(
    id: number,
    dto: AtualizarEmpresaDto,
  ): Promise<AtualizarEmpresaResult> {
    const existe = await this.repo.findById(id)
    if (!existe) return left(new EmpresaNaoEncontradaError(id))

    if (dto.cnpj && dto.cnpj !== existe.cnpj) {
      const cnpjEmUso = await this.repo.findByCnpj(dto.cnpj)
      if (cnpjEmUso) return left(new CnpjJaCadastradoError(dto.cnpj))
    }

    const empresa = await this.repo.update(id, dto)
    return right({ empresa })
  }
}
