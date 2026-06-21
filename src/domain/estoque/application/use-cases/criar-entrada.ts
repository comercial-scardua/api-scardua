import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { Injectable } from '@nestjs/common'
import type { stock_entries } from '@prisma/client'
import { SupabaseService } from '../../../../common/supabase/supabase.service'
import { type Either, left, right } from '../../../../core/either'
import {
  type CriarEntradaData,
  EstoqueRepository,
} from '../repositories/estoque-repository'
import { ProdutoNaoEncontradoError } from './errors/produto-nao-encontrado.error'

type CriarEntradaResult = Either<
  ProdutoNaoEncontradoError,
  { entrada: stock_entries }
>

@Injectable()
export class CriarEntradaUseCase {
  constructor(
    private repo: EstoqueRepository,
    private supabase: SupabaseService,
  ) {}

  async execute(
    dto: CriarEntradaData,
    userId: string,
    file?: Express.Multer.File,
  ): Promise<CriarEntradaResult> {
    const produto = await this.repo.findProdutoById(dto.produtoId)
    if (!produto) return left(new ProdutoNaoEncontradoError(dto.produtoId))

    let arquivoUrl: string | undefined
    if (file) {
      const ext = extname(file.originalname)
      const path = `notas-fiscais/entrada_${Date.now()}_${randomUUID().slice(0, 8)}${ext}`
      arquivoUrl = await this.supabase.upload(
        'uploads',
        path,
        file.buffer,
        file.mimetype,
      )
    }

    const entrada = await this.repo.criarEntrada(dto, userId, arquivoUrl)
    return right({ entrada })
  }
}
