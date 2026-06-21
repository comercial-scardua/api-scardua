import { Injectable } from '@nestjs/common'
import { right } from '../../../../core/either'
import type { CriarNcmData } from '../repositories/ncm-repository'
import { NcmRepository } from '../repositories/ncm-repository'

@Injectable()
export class ImportarNcmUseCase {
  constructor(private repo: NcmRepository) {}

  async execute(itens: CriarNcmData[], usuarioNome: string) {
    const resultado = await this.repo.importar(itens, usuarioNome)
    return right(resultado)
  }
}
