import { Injectable } from '@nestjs/common';
import { type Either, right } from '../../../core/either';
import type { CriarPatrimonioDto } from '../dto/criar-patrimonio.dto';
import { PatrimoniosRepository } from '../repositories/patrimonios.repository';

type CriarResult = Either<never, { id: number }>;

@Injectable()
export class CriarPatrimonioUseCase {
  constructor(private repo: PatrimoniosRepository) {}

  async execute(dto: CriarPatrimonioDto): Promise<CriarResult> {
    const patrimonio = await this.repo.create(dto);
    return right({ id: patrimonio.id });
  }
}
