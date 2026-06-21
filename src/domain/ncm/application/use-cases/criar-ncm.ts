import { Injectable } from '@nestjs/common'
import type { ncm } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import type { CriarNcmData } from '../repositories/ncm-repository'
import { NcmRepository } from '../repositories/ncm-repository'
import { NcmDuplicadoError } from './errors/ncm-duplicado.error'

type CriarNcmResult = Either<NcmDuplicadoError, { ncm: ncm }>

@Injectable()
export class CriarNcmUseCase {
  constructor(private repo: NcmRepository) {}

  async execute(
    data: CriarNcmData,
    usuarioNome: string,
  ): Promise<CriarNcmResult> {
    const existe = await this.repo.findByUniqueKey({
      codigo_ncm: data.codigo_ncm.trim(),
      categoria_cliente: data.categoria_cliente.trim(),
      empresa: data.empresa.trim(),
      uf_emissor: data.uf_emissor.trim().toUpperCase(),
      uf_destino: data.uf_destino.trim().toUpperCase(),
      cst_origem: data.cst_origem ?? '',
    })

    if (existe) return left(new NcmDuplicadoError())

    const ncm = await this.repo.create(data, usuarioNome)
    return right({ ncm })
  }
}
