import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../core/either'
import type { CriarEmpresaDto } from '../dto/criar-empresa.dto'
import type { EmpresaCompleta } from '../repositories/empresas.repository'
import { EmpresasRepository } from '../repositories/empresas.repository'
import { CnpjJaCadastradoError } from './errors/cnpj-ja-cadastrado.error'

type CriarEmpresaResult = Either<
  CnpjJaCadastradoError,
  { empresa: EmpresaCompleta }
>

@Injectable()
export class CriarEmpresaUseCase {
  constructor(private repo: EmpresasRepository) {}

  async execute(
    dto: CriarEmpresaDto,
    criadoPorId: string,
  ): Promise<CriarEmpresaResult> {
    if (dto.cnpj) {
      const existente = await this.repo.findByCnpj(dto.cnpj)
      if (existente) return left(new CnpjJaCadastradoError(dto.cnpj))
    }

    const empresa = await this.repo.create(dto, criadoPorId)
    return right({ empresa })
  }
}
