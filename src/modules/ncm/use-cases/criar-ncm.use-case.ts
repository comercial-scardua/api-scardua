import { Injectable } from '@nestjs/common'
import type { ncm } from '@prisma/client'
import { type Either, left, right } from '../../../core/either'
import type { CriarNcmDto } from '../dto/criar-ncm.dto'
import { NcmRepository } from '../repositories/ncm.repository'
import { NcmDuplicadoError } from './errors/ncm-duplicado.error'

type CriarNcmResult = Either<NcmDuplicadoError, { ncm: ncm }>

@Injectable()
export class CriarNcmUseCase {
  constructor(private repo: NcmRepository) {}

  async execute(
    dto: CriarNcmDto,
    usuarioNome: string,
  ): Promise<CriarNcmResult> {
    const existe = await this.repo.findByUniqueKey({
      codigo_ncm: dto.codigo_ncm.trim(),
      categoria_cliente: dto.categoria_cliente.trim(),
      empresa: dto.empresa.trim(),
      uf_emissor: dto.uf_emissor.trim().toUpperCase(),
      uf_destino: dto.uf_destino.trim().toUpperCase(),
      cst_origem: dto.cst_origem ?? '',
    })

    if (existe) return left(new NcmDuplicadoError())

    const ncm = await this.repo.create(dto, usuarioNome)
    return right({ ncm })
  }
}
