import { Injectable } from '@nestjs/common';
import { right } from '../../../core/either';
import type { CriarNcmDto } from '../dto/criar-ncm.dto';
import type { NcmRepository } from '../repositories/ncm.repository';

@Injectable()
export class ImportarNcmUseCase {
  constructor(private repo: NcmRepository) {}

  async execute(itens: CriarNcmDto[], usuarioNome: string) {
    const resultado = await this.repo.importar(itens, usuarioNome);
    return right(resultado);
  }
}
