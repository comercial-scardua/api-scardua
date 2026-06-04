import { Injectable } from '@nestjs/common';
import type { PermissoesRepository } from '../repositories/permissoes.repository';

@Injectable()
export class ListarPermissoesUseCase {
  constructor(private repo: PermissoesRepository) {}

  execute(userId: string) {
    return this.repo.findByUserId(userId);
  }
}
