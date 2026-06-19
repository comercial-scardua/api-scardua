import type { manual, manual_arquivos } from '@prisma/client'
import type { AtualizarManualDto } from '../dto/atualizar-manual.dto'
import type { CriarManualDto } from '../dto/criar-manual.dto'

export type ManualSemDescricao = Omit<manual, 'descricao'> & {
  arquivos: manual_arquivos[]
}

export type ManualCompleto = manual & { arquivos: manual_arquivos[] }

export abstract class ManuaisRepository {
  abstract findAll(): Promise<ManualSemDescricao[]>
  abstract findById(id: number): Promise<ManualCompleto | null>
  abstract create(
    data: CriarManualDto,
    usuarioNome: string,
  ): Promise<ManualCompleto>
  abstract update(id: number, data: AtualizarManualDto): Promise<ManualCompleto>
  abstract desativar(id: number): Promise<manual>
  abstract adicionarArquivo(
    manualId: number,
    arquivo: {
      nome_original: string
      caminho_arquivo: string
      tipo_arquivo?: string
      tamanho_arquivo?: number
    },
  ): Promise<manual_arquivos>
  abstract removerArquivo(
    manualId: number,
    arquivoId: number,
  ): Promise<manual_arquivos | null>
}
