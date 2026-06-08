import { Injectable } from '@nestjs/common';
import { type Either, left, right } from '../../../core/either';
import { SupabaseService } from '../../../common/supabase/supabase.service';
import { ContratosRepository } from '../repositories/contratos.repository';
import { ContratoNaoEncontradoError } from './errors/contrato-nao-encontrado.error';

type ExcluirContratoResult = Either<ContratoNaoEncontradoError, null>;

@Injectable()
export class ExcluirContratoUseCase {
  constructor(
    private repo: ContratosRepository,
    private supabase: SupabaseService,
  ) {}

  async execute(id: number): Promise<ExcluirContratoResult> {
    const contrato = await this.repo.findById(id);
    if (!contrato) return left(new ContratoNaoEncontradoError(id));

    // Remove arquivos do Supabase (falhas são ignoradas — contrato será excluído mesmo assim)
    for (const arquivo of contrato.arquivos) {
      const path = this.supabase.extractPathFromUrl(arquivo.caminho_arquivo, 'uploads');
      if (path) {
        await this.supabase.remove('uploads', [path]).catch(() => null);
      }
    }

    await this.repo.excluir(id);
    return right(null);
  }
}
