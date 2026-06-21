import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'

interface ProxyImageRequest {
  url: string
}

interface ProxyImageError {
  message: string
}

interface ProxyImageResponse {
  contentType: string
  buffer: Buffer
}

type ProxyImageUseCaseResponse = Either<ProxyImageError, ProxyImageResponse>

@Injectable()
export class ProxyImageUseCase {
  async execute({
    url,
  }: ProxyImageRequest): Promise<ProxyImageUseCaseResponse> {
    if (!url) {
      return left({ message: 'Parâmetro url é obrigatório' })
    }

    if (!url.startsWith('https://')) {
      return left({ message: 'Apenas URLs HTTPS são permitidas' })
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return left({ message: 'URL inválida' })
    }

    const hostname = parsedUrl.hostname.toLowerCase()
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.endsWith('.local')
    ) {
      return left({ message: 'URLs de localhost não são permitidas' })
    }

    try {
      const response = await fetch(url)

      if (!response.ok) {
        return left({
          message: `Falha ao buscar imagem: ${response.status} ${response.statusText}`,
        })
      }

      const contentType = response.headers.get('content-type') ?? 'image/jpeg'
      const buffer = Buffer.from(await response.arrayBuffer())

      return right({ contentType, buffer })
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Erro ao buscar imagem'
      return left({ message: msg })
    }
  }
}
