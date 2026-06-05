import { Injectable } from '@nestjs/common';
import { right } from '../../../core/either';
import type { CriarManualDto } from '../dto/criar-manual.dto';
import type { ManualCompleto, ManuaisRepository } from '../repositories/manuais.repository';

@Injectable()
export class CriarManualUseCase {
  constructor(private repo: ManuaisRepository) {}

  async execute(dto: CriarManualDto, usuarioNome: string) {
    const manual = await this.repo.create(dto, usuarioNome);
    return right({ manual: manual as ManualCompleto });
  }
}
