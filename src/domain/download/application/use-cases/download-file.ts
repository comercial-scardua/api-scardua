import { Injectable } from '@nestjs/common'
import { normalize, posix } from 'path'
import { SupabaseService } from '../../../../common/supabase/supabase.service'
import { type Either, left, right } from '../../../../core/either'

interface DownloadFileRequest {
  filePath: string
}

interface DownloadError {
  message: string
}

type DownloadFileUseCaseResponse = Either<DownloadError, { signedUrl: string }>

@Injectable()
export class DownloadFileUseCase {
  constructor(private supabase: SupabaseService) {}

  async execute({
    filePath,
  }: DownloadFileRequest): Promise<DownloadFileUseCaseResponse> {
    const normalized = posix.normalize(filePath).replace(/\\/g, '/')
    if (
      normalized.startsWith('/') ||
      normalized.startsWith('..') ||
      normalized.includes('\0')
    ) {
      return left({ message: 'Caminho de arquivo inválido' })
    }

    try {
      const signedUrl = await this.supabase.createSignedDownloadUrl(
        'uploads',
        normalized,
      )
      return right({ signedUrl })
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Erro ao gerar URL de download'
      return left({ message: msg })
    }
  }
}
