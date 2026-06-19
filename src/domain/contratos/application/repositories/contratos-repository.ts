import type { contrato_arquivos, contratos } from '@prisma/client'

export type ContratoComArquivos = contratos & {
  arquivos: contrato_arquivos[]
}

export interface CreateContratoData {
  numero: string
  titulo: string
  fornecedor: string
  valor: number
  data_inicio: string
  data_vencimento?: string
  vencimento_indeterminado?: boolean
  departamento: string
  responsavel: string
  descricao?: string
  tipo_contrato?: string
  renovacao_automatica?: boolean
  alertas_ativos?: boolean
  observacao?: string
}

export type UpdateContratoData = Partial<Omit<CreateContratoData, 'numero'>>

export interface AddArquivoData {
  nome_original: string
  nome: string
  caminho_arquivo: string
  tipo_arquivo?: string
  tamanho_arquivo?: number
}

export abstract class ContratosRepository {
  abstract findAll(): Promise<ContratoComArquivos[]>
  abstract findById(id: number): Promise<ContratoComArquivos | null>
  abstract findByNumero(numero: string): Promise<contratos | null>
  abstract findArquivo(
    contratoId: number,
    arquivoId: number,
  ): Promise<contrato_arquivos | null>
  abstract create(data: CreateContratoData): Promise<contratos>
  abstract update(id: number, data: UpdateContratoData): Promise<contratos>
  abstract alternarStatus(id: number): Promise<contratos>
  abstract renovar(id: number): Promise<contratos>
  abstract excluir(id: number): Promise<void>
  abstract adicionarArquivo(
    contratoId: number,
    arquivo: AddArquivoData,
  ): Promise<contrato_arquivos>
  abstract removerArquivo(
    contratoId: number,
    arquivoId: number,
  ): Promise<contrato_arquivos | null>
}
