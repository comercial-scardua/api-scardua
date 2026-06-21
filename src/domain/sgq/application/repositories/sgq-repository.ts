export interface CriarDocumentoSgqData {
  code: string
  title: string
  type: string
  description?: string
  processId?: number
  processName?: string
  ownerId: string
  ownerName: string
  currentVersion?: string
  status?: string
  issueDate?: Date
  reviewDate?: Date
  fileUrl?: string
  attachments?: string
  approvedById?: string
  approvedByName?: string
  approvalDate?: Date
  approvalComments?: string
  createdBy?: string
}

export interface CriarProcessoSgqData {
  code: string
  name: string
  description?: string
  status?: string
  ownerId: string
  ownerName: string
  createdBy?: string
}

export interface CriarNcSgqData {
  code: string
  title: string
  description: string
  origin: string
  processId?: number
  processName?: string
  ownerId: string
  ownerName: string
  openingDate?: Date
  deadline?: Date
  closureDate?: Date
  status?: string
  rootCauseAnalysis?: string
  immediateAction?: string
  evidenceFiles?: string
  closureNotes?: string
  createdBy?: string
}

export abstract class SgqRepository {
  abstract findAllDocumentos(filters: {
    status?: string
    type?: string
    processId?: number
    search?: string
  }): Promise<any[]>

  abstract findDocumentoById(id: number): Promise<any>

  abstract createDocumento(data: CriarDocumentoSgqData): Promise<any>

  abstract updateDocumento(
    id: number,
    data: Partial<CriarDocumentoSgqData>,
  ): Promise<any>

  abstract findAllProcessos(filters: {
    status?: string
    search?: string
  }): Promise<any[]>

  abstract createProcesso(data: CriarProcessoSgqData): Promise<any>

  abstract findAllNCs(filters: {
    status?: string
    origin?: string
    processId?: number
  }): Promise<any[]>

  abstract createNC(data: CriarNcSgqData): Promise<any>

  abstract findDocumentosComArquivo(): Promise<any[]>

  abstract getDashboard(): Promise<any>

  abstract findHelpArticles(filters: {
    category?: string
    module?: string
  }): Promise<any[]>
}
