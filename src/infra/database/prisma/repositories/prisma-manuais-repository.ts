import { Injectable } from '@nestjs/common'
import type { manual, manual_arquivos } from '@prisma/client'
import {
  type AtualizarManualData,
  type CriarManualData,
  type ManuaisRepository,
  type ManualCompleto,
} from '../../../../domain/manuais/application/repositories/manuais-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

function sanitizarDescricao(texto: string): string {
  return Array.from(texto)
    .filter((c) => {
      const code = c.codePointAt(0) ?? 0
      return code < 128 || (code >= 160 && code <= 255)
    })
    .join('')
}

@Injectable()
export class PrismaManuaisRepository implements ManuaisRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const manuais = await this.prisma.manual.findMany({
      where: { ativo: true },
      select: {
        id: true,
        assunto: true,
        departamento: true,
        restrito: true,
        ativo: true,
        usuario_id: true,
        usuario_nome: true,
        data_upload: true,
        data_modificado: true,
      },
      orderBy: { data_modificado: 'desc' },
    })

    const ids = manuais.map((m) => m.id)
    const arquivos = await this.prisma.manual_arquivos.findMany({
      where: { manual_id: { in: ids } },
    })

    return manuais.map((m) => ({
      ...m,
      arquivos: arquivos.filter((a) => a.manual_id === m.id),
    })) as any
  }

  async findById(id: number): Promise<ManualCompleto | null> {
    const [manual, arquivos] = await Promise.all([
      this.prisma.manual.findUnique({ where: { id } }),
      this.prisma.manual_arquivos.findMany({ where: { manual_id: id } }),
    ])

    if (!manual) return null
    return { ...manual, arquivos } as ManualCompleto
  }

  async create(
    data: CriarManualData,
    usuarioNome: string,
  ): Promise<ManualCompleto> {
    const descricaoSanitizada = sanitizarDescricao(data.descricao)

    const manual = await this.prisma.manual.create({
      data: {
        assunto: data.assunto.trim(),
        departamento: data.departamento.trim(),
        descricao: descricaoSanitizada,
        restrito: data.restrito ?? false,
        usuario_nome: usuarioNome,
        ativo: true,
        data_upload: new Date(),
        data_modificado: new Date(),
      },
    })

    return { ...manual, arquivos: [] } as ManualCompleto
  }

  async update(id: number, data: AtualizarManualData): Promise<ManualCompleto> {
    const updates: Record<string, unknown> = { data_modificado: new Date() }
    if (data.assunto) updates.assunto = data.assunto.trim()
    if (data.departamento) updates.departamento = data.departamento.trim()
    if (data.descricao) updates.descricao = sanitizarDescricao(data.descricao)
    if (data.restrito !== undefined) updates.restrito = data.restrito

    const [manual, arquivos] = await Promise.all([
      this.prisma.manual.update({ where: { id }, data: updates }),
      this.prisma.manual_arquivos.findMany({ where: { manual_id: id } }),
    ])

    return { ...manual, arquivos } as ManualCompleto
  }

  desativar(id: number): Promise<manual> {
    return this.prisma.manual.update({
      where: { id },
      data: { ativo: false, data_modificado: new Date() },
    })
  }

  adicionarArquivo(
    manualId: number,
    arquivo: {
      nome_original: string
      caminho_arquivo: string
      tipo_arquivo?: string
      tamanho_arquivo?: number
    },
  ): Promise<manual_arquivos> {
    return this.prisma.manual_arquivos.create({
      data: { manual_id: manualId, ...arquivo },
    })
  }

  async removerArquivo(
    manualId: number,
    arquivoId: number,
  ): Promise<manual_arquivos | null> {
    const arquivo = await this.prisma.manual_arquivos.findFirst({
      where: { id: arquivoId, manual_id: manualId },
    })
    if (!arquivo) return null

    await this.prisma.manual_arquivos.delete({ where: { id: arquivoId } })
    return arquivo
  }
}
