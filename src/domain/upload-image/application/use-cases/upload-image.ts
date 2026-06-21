import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../../../../common/supabase/supabase.service'
import { type Either, left, right } from '../../../../core/either'

interface UploadImageRequest {
  file: {
    originalname: string
    buffer: Buffer
    mimetype: string
  }
}

interface UploadImageError {
  message: string
}

type UploadImageUseCaseResponse = Either<UploadImageError, { url: string }>

@Injectable()
export class UploadImageUseCase {
  constructor(private supabase: SupabaseService) {}

  async execute({
    file,
  }: UploadImageRequest): Promise<UploadImageUseCaseResponse> {
    if (!file) {
      return left({ message: 'Arquivo de imagem não enviado' })
    }

    const path = `images/${Date.now()}_${file.originalname}`
    const url = await this.supabase.upload(
      'uploads',
      path,
      file.buffer,
      file.mimetype,
    )

    return right({ url })
  }
}
