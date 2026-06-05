import { Injectable } from '@nestjs/common';
import { type Either, left, right } from '../../../core/either';
import type { SupabaseService } from '../../../common/supabase/supabase.service';
import type { ContratosRepository } from '../repositories/contratos.repository';
import { ContratoNaoEncontradoError } from './errors/contrato-nao-encontrado.error';
import { randomUUID } from 'crypto';
import { extname } from 'path';

type AdicionarArquivoResult = Either<ContratoNaoEncontradoError, { url: string }>;
type RemoverArquivoResult = Either<ContratoNaoEncontradoError, null>;

@Injectable()
export class GerenciarArquivoContratoUseCase {
  constructor(
    private repo: ContratosRepository,
    private supabase: SupabaseService,
  ) {}

  async adicionar(
    contratoId: number,
    file: Express.Multer.File,
  ): Promise<AdicionarArquivoResult> {
    const existe = await this.repo.findById(contratoId);
    if (!existe) return left(new ContratoNaoEncontradoError(contratoId));

    const ext = extname(file.originalname);
    const nome = `contrato_${contratoId}_${Date.now()}_${randomUUID().slice(0, 8)}${ext}`;
    const path = `contratos/${nome}`;

    const url = await this.supabase.upload('uploads', path, file.buffer, file.mimetype);

    await this.repo.adicionarArquivo(contratoId, {
      nome_original: file.originalname,
      nome,
      caminho_arquivo: url,
      tipo_arquivo: file.mimetype,
      tamanho_arquivo: file.size,
    });

    return right({ url });
  }

  async remover(
    contratoId: number,
    arquivoId: number,
  ): Promise<RemoverArquivoResult> {
    const existe = await this.repo.findById(contratoId);
    if (!existe) return left(new ContratoNaoEncontradoError(contratoId));

    const arquivo = await this.repo.removerArquivo(contratoId, arquivoId);
    if (arquivo) {
      const path = this.supabase.extractPathFromUrl(arquivo.caminho_arquivo, 'uploads');
      if (path) await this.supabase.remove('uploads', [path]).catch(() => null);
    }

    return right(null);
  }
}
