import { Injectable } from '@nestjs/common'
import { NcmRepository } from '../repositories/ncm-repository'

@Injectable()
export class ListarNcmUseCase {
  constructor(private repo: NcmRepository) {}

  execute(filters: {
    termo?: string
    categoria?: string
    empresa?: string
    uf_emissor?: string
    uf_destino?: string
  }) {
    return this.repo.findAll(filters)
  }
}
