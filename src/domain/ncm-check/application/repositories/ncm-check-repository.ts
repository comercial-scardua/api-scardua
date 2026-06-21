export type NcmRecord = {
  id: number
  codigo_ncm: string
  [key: string]: unknown
}

export abstract class NcmCheckRepository {
  abstract findByCodigoPrefix(codigo: string): Promise<NcmRecord | null>
}
