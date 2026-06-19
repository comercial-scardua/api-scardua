import type { ncm } from '@prisma/client'
import type { AtualizarNcmDto } from '../dto/atualizar-ncm.dto'
import type { CriarNcmDto } from '../dto/criar-ncm.dto'

export type NcmUniqueKey = {
  codigo_ncm: string
  categoria_cliente: string
  empresa: string
  uf_emissor: string
  uf_destino: string
  cst_origem: string
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
  abstract create(data: CriarNcmDto, usuarioNome: string): Promise<ncm>
  abstract update(id: number, data: AtualizarNcmDto): Promise<ncm>
  abstract desativar(id: number): Promise<ncm>
  abstract importar(
    itens: CriarNcmDto[],
    usuarioNome: string,
  ): Promise<{ criados: number; atualizados: number }>
}
