import { Injectable } from '@nestjs/common'
import {
  sgq_documents_status,
  sgq_documents_type,
  sgq_non_conformities_origin,
  sgq_non_conformities_status,
} from '@prisma/client'
import {
  CriarDocumentoSgqData,
  CriarNcSgqData,
  CriarProcessoSgqData,
  SgqRepository,
} from '../../../../domain/sgq/application/repositories/sgq-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaSgqRepository implements SgqRepository {
  constructor(private prisma: PrismaService) {}

  async findAllDocumentos(filters: {
    status?: string
    type?: string
    processId?: number
    search?: string
  }) {
    const where: any = {}
    if (filters.status)
      where.status = filters.status as sgq_documents_status
    if (filters.type) where.type = filters.type as sgq_documents_type
    if (filters.processId) where.processId = filters.processId
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { code: { contains: filters.search } },
        { description: { contains: filters.search } },
      ]
    }
    return this.prisma.sgq_documents.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findDocumentoById(id: number) {
    return this.prisma.sgq_documents.findUnique({ where: { id } })
  }

  async createDocumento(data: CriarDocumentoSgqData) {
    return this.prisma.sgq_documents.create({
      data: {
        code: data.code,
        title: data.title,
        type: data.type as sgq_documents_type,
        description: data.description,
        processId: data.processId,
        processName: data.processName,
        ownerId: data.ownerId,
        ownerName: data.ownerName,
        currentVersion: data.currentVersion ?? '1.0',
        status:
          (data.status as sgq_documents_status) ??
          sgq_documents_status.DRAFT,
        issueDate: data.issueDate,
        reviewDate: data.reviewDate,
        fileUrl: data.fileUrl,
        attachments: data.attachments,
        approvedById: data.approvedById,
        approvedByName: data.approvedByName,
        approvalDate: data.approvalDate,
        approvalComments: data.approvalComments,
        createdBy: data.createdBy,
        updatedAt: new Date(),
      },
    })
  }

  async updateDocumento(id: number, data: Partial<CriarDocumentoSgqData>) {
    const updateData: any = { ...data, updatedAt: new Date() }
    if (data.type) updateData.type = data.type as sgq_documents_type
    if (data.status)
      updateData.status = data.status as sgq_documents_status
    return this.prisma.sgq_documents.update({
      where: { id },
      data: updateData,
    })
  }

  async findAllProcessos(filters: { status?: string; search?: string }) {
    const where: any = {}
    if (filters.status) where.status = filters.status
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { code: { contains: filters.search } },
        { description: { contains: filters.search } },
      ]
    }
    return this.prisma.sgq_processes.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  async createProcesso(data: CriarProcessoSgqData) {
    return this.prisma.sgq_processes.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        status: data.status ?? 'active',
        ownerId: data.ownerId,
        ownerName: data.ownerName,
        createdBy: data.createdBy,
        updatedAt: new Date(),
      },
    })
  }

  async findAllNCs(filters: {
    status?: string
    origin?: string
    processId?: number
  }) {
    const where: any = {}
    if (filters.status)
      where.status = filters.status as sgq_non_conformities_status
    if (filters.origin)
      where.origin = filters.origin as sgq_non_conformities_origin
    if (filters.processId) where.processId = filters.processId
    return this.prisma.sgq_non_conformities.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  async createNC(data: CriarNcSgqData) {
    return this.prisma.sgq_non_conformities.create({
      data: {
        code: data.code,
        title: data.title,
        description: data.description,
        origin: data.origin as sgq_non_conformities_origin,
        processId: data.processId,
        processName: data.processName,
        ownerId: data.ownerId,
        ownerName: data.ownerName,
        openingDate: data.openingDate ?? new Date(),
        deadline: data.deadline,
        closureDate: data.closureDate,
        status:
          (data.status as sgq_non_conformities_status) ??
          sgq_non_conformities_status.OPEN,
        rootCauseAnalysis: data.rootCauseAnalysis,
        immediateAction: data.immediateAction,
        evidenceFiles: data.evidenceFiles,
        closureNotes: data.closureNotes,
        createdBy: data.createdBy,
        updatedAt: new Date(),
      },
    })
  }

  async findDocumentosComArquivo() {
    return this.prisma.sgq_documents.findMany({
      where: { fileUrl: { not: null } },
      select: {
        id: true,
        code: true,
        title: true,
        type: true,
        status: true,
        fileUrl: true,
        attachments: true,
        ownerId: true,
        ownerName: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async getDashboard() {
    const [docsPorStatus, ncsPorStatus, totalProcessos] =
      await Promise.all([
        this.prisma.sgq_documents.groupBy({
          by: ['status'],
          _count: { id: true },
        }),
        this.prisma.sgq_non_conformities.groupBy({
          by: ['status'],
          _count: { id: true },
        }),
        this.prisma.sgq_processes.count(),
      ])
    const totalDocumentos = docsPorStatus.reduce(
      (acc, d) => acc + d._count.id,
      0,
    )
    const totalNCs = ncsPorStatus.reduce(
      (acc, n) => acc + n._count.id,
      0,
    )
    return {
      documentos: {
        total: totalDocumentos,
        porStatus: docsPorStatus.map((d) => ({
          status: d.status,
          total: d._count.id,
        })),
      },
      naoConformidades: {
        total: totalNCs,
        porStatus: ncsPorStatus.map((n) => ({
          status: n.status,
          total: n._count.id,
        })),
      },
      processos: { total: totalProcessos },
    }
  }

  async findHelpArticles(filters: {
    category?: string
    module?: string
  }) {
    const where: any = { active: true }
    if (filters.category) where.category = filters.category
    if (filters.module) where.relatedModule = filters.module
    return this.prisma.sgq_help_articles.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    })
  }
}
