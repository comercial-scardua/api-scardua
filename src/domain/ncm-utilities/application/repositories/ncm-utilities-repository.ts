export interface NcmListFilters {
  page?: number
  limit?: number
}

export interface NcmSearchFilters {
  q?: string
  codigo?: string
  descricao?: string
}

export interface NcmListResult {
  total: number
  page: number
  limit: number
  totalPages: number
  data: unknown[]
}

export interface NcmDiagnostico {
  total: number
  ativos: number
  inativos: number
}

export interface NcmIntegridade {
  total: number
  integridade: {
    semCodigoNcm: number
    semEmpresa: number
    semUfEmissor: number
    semUfDestino: number
  }
  valido: boolean
}

export interface PecasSemNcmResult {
  total: number
  registros: unknown[]
}

export abstract class NcmUtilitiesRepository {
  abstract listNcms(filters: NcmListFilters): Promise<NcmListResult>
  abstract searchNcm(
    filters: NcmSearchFilters,
  ): Promise<{ total: number; data: unknown[] }>
  abstract diagnoseNcmLimit(): Promise<NcmDiagnostico>
  abstract finalNcmValidation(): Promise<NcmIntegridade>
  abstract validarPecasNcm(): Promise<PecasSemNcmResult>
}
