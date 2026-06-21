import type { PassThrough } from 'node:stream'
import { PassThrough as PassThroughStream } from 'node:stream'
import { Injectable } from '@nestjs/common'
import PDFDocument from 'pdfkit'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CalculoHorasUtil } from '../utils/calculo-horas.util'

@Injectable()
export class GerarTermoPdfUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(
    colaboradorId: number,
    dataInicio?: Date,
    dataFim?: Date,
  ): Promise<PassThrough> {
    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { id: colaboradorId },
      include: { registrosBancoHoras: true },
    })

    if (!colaborador) {
      throw new Error(`Colaborador #${colaboradorId} não encontrado`)
    }

    const where: any = { colaborador_id: colaboradorId }
    if (dataInicio || dataFim) {
      where.data = {}
      if (dataInicio) where.data.gte = dataInicio
      if (dataFim) where.data.lte = dataFim
    }

    const registros = await this.prisma.registros_banco_horas.findMany({
      where,
      orderBy: { data: 'asc' },
    })

    const conta = await this.prisma.conta_corrente_horas.findUnique({
      where: { colaborador_id: colaboradorId },
    })

    // Criar PDF
    const doc = new PDFDocument({ margin: 50 })
    const stream = new PassThroughStream()
    doc.pipe(stream)

    // Cabeçalho
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('TERMO DE BANCO DE HORAS', { align: 'center' })
    doc.moveDown(0.5)

    // Dados do colaborador
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('DADOS DO COLABORADOR', { underline: true })
    doc.fontSize(10).font('Helvetica')
    doc.text(`Nome: ${colaborador.nome} ${colaborador.sobrenome}`)
    doc.text(`CPF: ${colaborador.cpf}`)
    doc.text(`Cargo: ${colaborador.cargo || 'N/A'}`)
    doc.text(`Email: ${colaborador.email || 'N/A'}`)
    doc.moveDown(0.5)

    // Período
    doc.fontSize(11).font('Helvetica-Bold').text('PERÍODO', { underline: true })
    doc.fontSize(10).font('Helvetica')
    const periodoInicio = dataInicio
      ? dataInicio.toLocaleDateString('pt-BR')
      : 'Sem filtro'
    const periodoFim = dataFim
      ? dataFim.toLocaleDateString('pt-BR')
      : 'Sem filtro'
    doc.text(`De: ${periodoInicio}`)
    doc.text(`Até: ${periodoFim}`)
    doc.moveDown(0.5)

    // Tabela de registros
    if (registros.length > 0) {
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('REGISTROS', { underline: true })
      doc.moveDown(0.3)

      // Cabeçalho da tabela
      const startX = 50
      const colWidths = [90, 70, 70, 80, 60]
      const y = doc.y

      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Data', startX, y)
        .text('Entrada', startX + colWidths[0], y)
        .text('Saída', startX + colWidths[0] + colWidths[1], y)
        .text('Tipo', startX + colWidths[0] + colWidths[1] + colWidths[2], y)
        .text(
          'Horas',
          startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
          y,
        )

      doc
        .moveTo(startX, doc.y + 15)
        .lineTo(500, doc.y + 15)
        .stroke()
      doc.moveDown(1)

      // Dados da tabela
      doc.fontSize(8).font('Helvetica')
      registros.forEach((reg) => {
        const horas = CalculoHorasUtil.calcularHorasDoRegistro(
          reg.hora_inicio,
          reg.hora_fim,
          reg.intervalo_minutos,
          reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
        )

        const data = reg.data.toLocaleDateString('pt-BR')
        const entrada = reg.hora_inicio || '-'
        const saida = reg.hora_fim || '-'
        const tipo = reg.tipo
        const horasFormatadas = CalculoHorasUtil.formatarHorasDecimal(horas)

        doc.text(data, startX, doc.y, { width: colWidths[0] })
        doc.text(entrada, startX + colWidths[0], doc.y - 12, {
          width: colWidths[1],
        })
        doc.text(saida, startX + colWidths[0] + colWidths[1], doc.y - 12, {
          width: colWidths[2],
        })
        doc.text(
          tipo,
          startX + colWidths[0] + colWidths[1] + colWidths[2],
          doc.y - 12,
          {
            width: colWidths[3],
          },
        )
        doc.text(
          horasFormatadas,
          startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
          doc.y - 12,
          {
            width: colWidths[4],
          },
        )

        doc.moveDown(0.8)
      })
    }

    doc.moveDown(0.5)

    // Resumo de saldo
    if (conta) {
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('RESUMO DE SALDO', { underline: true })
      doc.fontSize(10).font('Helvetica')
      doc.text(
        `Total Positivo: ${CalculoHorasUtil.formatarHorasDecimal(Number(conta.total_positivo))}`,
      )
      doc.text(
        `Total Negativo: ${CalculoHorasUtil.formatarHorasDecimal(Number(conta.total_negativo))}`,
      )
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#10b981')
        .text(
          `SALDO: ${CalculoHorasUtil.formatarHorasDecimal(Number(conta.saldo))}`,
        )
    }

    doc.moveDown(1)

    // Rodapé
    doc
      .fontSize(9)
      .fillColor('#666666')
      .text(
        `Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
        { align: 'center' },
      )

    doc.end()

    return stream
  }
}
