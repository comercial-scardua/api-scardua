import { Injectable } from '@nestjs/common'

@Injectable()
export class DeletarArquivoUseCase {
  async execute() {
    return { message: 'Operacao de arquivo nao disponivel via API direta' }
  }
}
