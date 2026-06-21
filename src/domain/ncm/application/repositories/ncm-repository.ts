import type { ncm } from '@prisma/client'

export type NcmUniqueKey = {
  codigo_ncm: string
  categoria_cliente: string
  empresa: string
  uf_emissor: string
  uf_destino: string
  cst_origem: string
}

export interface CriarNcmData {
  codigo_ncm: string
  categoria_cliente: string
  empresa: string
  uf_emissor: string
  uf_destino: string
  cst_origem?: string
  icms_dentro?: number
  icms_fora?: number
  fora_st?: string
  fora_difal?: string
  monofasico?: string
  pis?: number
  cofins?: number
  ipi?: number
  bc_pis_cof?: string
  bc_icms?: string
  mva?: number
  aliquota?: number
  obs_fonte?: string
}

export interface AtualizarNcmData {
  icms_dentro?: number
  icms_fora?: number
  fora_st?: string
  fora_difal?: string
  monofasico?: string
  pis?: number
  cofins?: number
  ipi?: number
  bc_pis_cof?: string
  bc_icms?: string
  mva?: number
  aliquota?: number
  obs_fonte?: string
}

export abstract class NcmRepository {
  abstract findAll(filters: {
    termo?: string
    categoria?: string
    empresa?: string
    uf_emissor?: string
    uf_destino?: string
  }): Promise<ncm[]>
  abstract findById(id: number): Promise<ncm | null>
  abstract findByUniqueKey(key: NcmUniqueKey): Promise<ncm | null>
  abstract create(data: CriarNcmData, usuarioNome: string): Promise<ncm>
  abstract update(id: number, data: AtualizarNcmData): Promise<ncm>
  abstract desativar(id: number): Promise<ncm>
  abstract importar(
    itens: CriarNcmData[],
    usuarioNome: string,
  ): Promise<{ criados: number; atualizados: number }>
}
