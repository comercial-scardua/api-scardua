import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../../../../common/supabase/supabase.service'
import { type Either, left, right } from '../../../../core/either'
import { ManuaisRepository } from '../repositories/manuais-repository'
import { ManualNaoEncontradoError } from './errors/manual-nao-encontrado.error'

type AdicionarArquivoResult = Either<ManualNaoEncontradoError, { url: string }>
type RemoverArquivoResult = Either<ManualNaoEncontradoError, null>

@Injectable()
export class GerenciarArquivoManualUseCase {
  constructor(
    private manuaisRepository: ManuaisRepository,
    private supabase: SupabaseService,
  ) {}

  async adicionar(
    manualId: number,
    file: Express.Multer.File,
  ): Promise<AdicionarArquivoResult> {
    const existe = await this.manuaisRepository.findById(manualId)
    if (!existe) return left(new ManualNaoEncontradoError(manualId))

    const ext = extname(file.originalname)
    const nome = `manual_${manualId}_${Date.now()}_${randomUUID().slice(0, 8)}${ext}`
    const path = `manuais/${nome}`

    const url = await this.supabase.upload(
      'uploads',
      path,
      file.buffer,
      file.mimetype,
    )

    await this.manuaisRepository.adicionarArquivo(manualId, {
      nome_original: file.originalname,
      caminho_arquivo: url,
      tipo_arquivo: file.mimetype,
      tamanho_arquivo: file.size,
    })

    return right({ url })
  }

  async remover(
    manualId: number,
    arquivoId: number,
  ): Promise<RemoverArquivoResult> {
    const existe = await this.manuaisRepository.findById(manualId)
    if (!existe) return left(new ManualNaoEncontradoError(manualId))

    const arquivo = await this.manuaisRepository.removerArquivo(
      manualId,
      arquivoId,
    )
    if (arquivo) {
      const path = this.supabase.extractPathFromUrl(
        arquivo.caminho_arquivo,
        'uploads',
      )
      if (path) await this.supabase.remove('uploads', [path]).catch(() => null)
    }

    return right(null)
  }
}
