import { Injectable } from '@nestjs/common'
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
    try {
      const signedUrl = await this.supabase.createSignedDownloadUrl(
        'uploads',
        filePath,
      )
      return right({ signedUrl })
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Erro ao gerar URL de download'
      return left({ message: msg })
    }
  }
}
