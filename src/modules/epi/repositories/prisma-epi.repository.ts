import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import type { AdicionarEpiCargoDto } from '../dto/adicionar-epi-cargo.dto'
import type { AtualizarCargoEpiDto } from '../dto/atualizar-cargo-epi.dto'
import type { AtualizarColaboradorEpiDto } from '../dto/atualizar-colaborador-epi.dto'
import type { AtualizarEpiDto } from '../dto/atualizar-epi.dto'
import type { CriarCargoEpiDto } from '../dto/criar-cargo-epi.dto'
import type { CriarEpiDto } from '../dto/criar-epi.dto'
import type { CriarMovimentacaoEpiDto } from '../dto/criar-movimentacao-epi.dto'
import type { CriarMovimentacaoEstoqueDto } from '../dto/criar-movimentacao-estoque.dto'
import type { CriarTransferenciaEpiDto } from '../dto/criar-transferencia-epi.dto'
import type { EpiRepository } from './epi.repository'

const SELECT_MOV_DETALHE = {
  id: true,
  colaborador_id: true,
  epi_id: true,
  tipo: true,
  quantidade: true,
  data_movimentacao: true,
  responsavel: true,
  proxima_entrega: true,
  motivo: true,
  observacoes: true,
  empresaId: true,
  createdAt: true,
  epi: {
    select: { id: true, nome: true, codigo: true, ca: true, categoria: true },
  },
  colaborador: { select: { id: true, nome: true, sobrenome: true } },
} as const

function calcDelta(tipo: string, quantidade: number): number {
  const t = tipo.toUpperCase()
  if (t === 'ENTRADA' || t === 'DEVOLUCAO') return quantidade
  if (t === 'SAIDA' || t === 'PERDA') return -quantidade
  if (t === 'AJUSTE') return quantidade
  return 0
}

async function upsertFilial(
  tx: any,
  epiId: number,
  empresaId: number,
  delta: number,
) {
  await tx.epi_estoque_filial.upsert({
    where: { epi_id_empresaId: { epi_id: epiId, empresaId } },
    create: { epi_id: epiId, empresaId, estoque_atual: Math.max(0, delta) },
    update: { estoque_atual: { increment: delta } },
  })
}

@Injectable()
export class PrismaEpiRepository implements EpiRepository {
  constructor(private prisma: PrismaService) {}

  // ── Perfil ────────────────────────────────────────────────────────────────

  async findGestorPerfil(userId: string) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } })
    if (!user)
      return {
        isAdmin: false,
        isGestor: false,
        colaboradorId: null,
        empresaIds: [],
        empresasGestor: [],
      }

    if (user.role === 'ADMIN')
      return {
        isAdmin: true,
        isGestor: false,
        colaboradorId: null,
        empresaIds: [],
        empresasGestor: [],
      }

    const colaborador = await this.prisma.colaboradores.findFirst({
      where: { userId },
      include: {
        gestorEmpresas: {
          include: { empresa: { select: { id: true, nomeEmpresa: true } } },
        },
      },
    })

    if (!colaborador)
      return {
        isAdmin: false,
        isGestor: false,
        colaboradorId: null,
        empresaIds: [],
        empresasGestor: [],
      }

    const empresasGestor = colaborador.gestorEmpresas.map((ge) => ({
      id: ge.empresa.id,
      nomeEmpresa: ge.empresa.nomeEmpresa,
    }))

    return {
      isAdmin: false,
      isGestor: colaborador.isGestor,
      colaboradorId: colaborador.id,
      empresaIds: empresasGestor.map((e) => e.id),
      empresasGestor,
    }
  }

  async findColaboradorIdByUserId(userId: string) {
    const col = await this.prisma.colaboradores.findFirst({
      where: { userId },
      select: { id: true },
    })
    return col?.id ?? null
  }

  // ── EPIs ──────────────────────────────────────────────────────────────────

  findAllEpis(filters?: {
    categoria?: string
    status?: string
    search?: string
    baixo_estoque?: boolean
  }) {
    const where: Record<string, unknown> = {}
    if (filters?.categoria) where.categoria = filters.categoria
    if (filters?.status) where.status = filters.status.toUpperCase()
    if (filters?.search) {
      where.OR = [
        { nome: { contains: filters.search } },
        { codigo: { contains: filters.search } },
        { ca: { contains: filters.search } },
        { fabricante: { contains: filters.search } },
      ]
    }
    if (filters?.baixo_estoque) {
      where.AND = [
        { status: 'ATIVO' },
        {
          estoque_atual: { lte: this.prisma.epis.fields.estoque_minimo as any },
        },
      ]
    }
    return this.prisma.epis.findMany({ where, orderBy: { nome: 'asc' } })
  }

  async findEpiById(id: number) {
    return this.prisma.epis.findUnique({
      where: { id },
      include: {
        cargos_obrigatorios: { include: { cargo: true } },
        movimentacoes: {
          take: 50,
          orderBy: { data_movimentacao: 'desc' },
          include: { colaborador: { select: { nome: true, sobrenome: true } } },
        },
        estoque_movimentacoes: {
          take: 50,
          orderBy: { data_movimentacao: 'desc' },
        },
      },
    })
  }

  async createEpi(data: CriarEpiDto, empresaId?: number) {
    const epi = await this.prisma.epis.create({
      data: {
        nome: data.nome,
        codigo: data.codigo,
        ca: data.ca,
        categoria: data.categoria,
        tamanho: data.tamanho,
        fabricante: data.fabricante,
        vida_util_dias: data.vida_util_dias,
        estoque_inicial: data.estoque_inicial ?? 0,
        estoque_atual: data.estoque_inicial ?? 0,
        estoque_minimo: data.estoque_minimo ?? 0,
        observacoes: data.observacoes,
      },
    })

    if ((data.estoque_inicial ?? 0) > 0 && empresaId) {
      await this.prisma.epi_estoque_movimentacoes.create({
        data: {
          epi_id: epi.id,
          tipo: 'ENTRADA' as any,
          quantidade: data.estoque_inicial!,
          data_movimentacao: new Date(),
          responsavel: 'Cadastro inicial',
          observacoes: 'Estoque inicial',
          empresaId,
        },
      })
      await upsertFilial(this.prisma, epi.id, empresaId, data.estoque_inicial!)
    }

    return epi
  }

  updateEpi(id: number, data: AtualizarEpiDto) {
    return this.prisma.epis.update({ where: { id }, data })
  }

  async deleteEpi(id: number) {
    const links = await this.prisma.epi_cargo_obrigatorio.count({
      where: { epi_id: id },
    })
    if (links > 0)
      throw new Error('EPI possui vínculos com cargos obrigatórios')
    await this.prisma.epis.delete({ where: { id } })
  }

  // ── Cargos ────────────────────────────────────────────────────────────────

  findAllCargos() {
    return this.prisma.epi_cargos.findMany({
      include: {
        _count: { select: { colaboradores: true, epis_obrigatorios: true } },
      },
      orderBy: { nome: 'asc' },
    })
  }

  findCargoById(id: number) {
    return this.prisma.epi_cargos.findUnique({
      where: { id },
      include: {
        epis_obrigatorios: {
          include: {
            epi: {
              select: {
                id: true,
                nome: true,
                ca: true,
                categoria: true,
                estoque_atual: true,
                status: true,
              },
            },
          },
        },
      },
    })
  }

  createCargo(data: CriarCargoEpiDto) {
    return this.prisma.epi_cargos.create({ data })
  }

  updateCargo(id: number, data: AtualizarCargoEpiDto) {
    return this.prisma.epi_cargos.update({ where: { id }, data })
  }

  async deleteCargo(id: number) {
    const links = await this.prisma.epi_cargo_obrigatorio.count({
      where: { cargo_id: id },
    })
    if (links > 0) throw new Error('Cargo possui EPIs obrigatórios vinculados')
    await this.prisma.epi_cargos.delete({ where: { id } })
  }

  // ── Cargo-EPI links ───────────────────────────────────────────────────────

  findCargoEpiLinks(cargo_id?: number) {
    return this.prisma.epi_cargo_obrigatorio.findMany({
      where: cargo_id ? { cargo_id } : undefined,
      include: {
        epi: {
          select: {
            id: true,
            nome: true,
            ca: true,
            categoria: true,
            estoque_atual: true,
            status: true,
          },
        },
      },
      orderBy: { epi: { nome: 'asc' } },
    })
  }

  async createCargoEpiLink(data: AdicionarEpiCargoDto & { cargo_id: number }) {
    const existing = await this.prisma.epi_cargo_obrigatorio.findUnique({
      where: {
        cargo_id_epi_id: { cargo_id: data.cargo_id, epi_id: data.epi_id },
      },
    })
    if (existing) throw new Error('Vínculo já existe')

    return this.prisma.epi_cargo_obrigatorio.create({
      data: {
        cargo_id: data.cargo_id,
        epi_id: data.epi_id,
        periodicidade_troca_dias: data.periodicidade_troca_dias,
        quantidade_padrao: data.quantidade_padrao ?? 1,
        obrigatorio: data.obrigatorio ?? true,
      },
      include: {
        epi: {
          select: {
            id: true,
            nome: true,
            ca: true,
            categoria: true,
            estoque_atual: true,
            status: true,
          },
        },
      },
    })
  }

  async deleteCargoEpiLink(id: number) {
    await this.prisma.epi_cargo_obrigatorio.delete({ where: { id } })
  }

  // ── Colaboradores ─────────────────────────────────────────────────────────

  async findColaboradores(
    filters?: { empresaId?: number; status?: string },
    gestorColaboradorId?: number,
  ) {
    const where: Record<string, unknown> = { oculto: false }
    if (filters?.empresaId) where.empresaId = filters.empresaId
    if (filters?.status === 'inativo') where.oculto = true
    // Filtra colaboradores cujo gestor é o informado, via tabela de junção.
    if (gestorColaboradorId !== undefined)
      where.gestoresRelacao = { some: { gestorId: gestorColaboradorId } }

    const cols = await this.prisma.colaboradores.findMany({
      where,
      include: {
        empresa: { select: { id: true, nomeEmpresa: true, cnpj: true } },
        epiCargo: { select: { id: true, nome: true } },
        gestoresRelacao: {
          take: 1,
          include: {
            gestor: { select: { id: true, nome: true, sobrenome: true } },
          },
        },
      },
      orderBy: { nome: 'asc' },
    })

    return cols.map((c) => {
      const gestor = c.gestoresRelacao[0]?.gestor ?? null
      return {
        id: c.id,
        nome: `${c.nome ?? ''} ${c.sobrenome ?? ''}`.trim(),
        matricula: c.numeroEmpresa,
        cargo_id: c.epiCargoId,
        cargo: c.epiCargo?.nome ?? null,
        setor: c.setor,
        unidade: c.empresa?.nomeEmpresa ?? null,
        data_admissao: c.admissao
          ? c.admissao.toISOString().split('T')[0]
          : null,
        status: c.oculto ? ('inativo' as const) : ('ativo' as const),
        gestor: gestor
          ? `${gestor.nome ?? ''} ${gestor.sobrenome ?? ''}`.trim()
          : null,
        gestorId: gestor?.id ?? null,
        observacoes: c.epiObservacoes ?? null,
        isGestor: c.isGestor,
        empresaId: c.empresaId,
        empresaNome: c.empresa?.nomeEmpresa ?? null,
        empresaCnpj: c.empresa?.cnpj ?? null,
      }
    })
  }

  async updateColaboradorEpi(id: number, data: AtualizarColaboradorEpiDto) {
    await this.prisma.colaboradores.update({
      where: { id },
      data: {
        ...(data.epiCargoId !== undefined && { epiCargoId: data.epiCargoId }),
        ...(data.epiObservacoes !== undefined && {
          epiObservacoes: data.epiObservacoes,
        }),
      },
    })

    // Vínculo de gestor é gerenciado na tabela de junção colaborador_gestores.
    if (data.gestorId !== undefined) {
      await this.prisma.colaborador_gestores.deleteMany({
        where: { colaboradorId: id },
      })
      if (data.gestorId !== null) {
        await this.prisma.colaborador_gestores.create({
          data: { colaboradorId: id, gestorId: data.gestorId },
        })
      }
    }

    const cols = await this.findColaboradores(undefined, undefined)
    return cols.find((c) => c.id === id)!
  }

  // ── Movimentações ─────────────────────────────────────────────────────────

  findMovimentacoes(filters?: {
    colaborador_id?: number
    epi_id?: number
    tipo?: string
    empresaId?: number
  }) {
    const where: Record<string, unknown> = {}
    if (filters?.colaborador_id) where.colaborador_id = filters.colaborador_id
    if (filters?.epi_id) where.epi_id = filters.epi_id
    if (filters?.tipo) where.tipo = filters.tipo.toUpperCase()
    if (filters?.empresaId) where.empresaId = filters.empresaId

    return this.prisma.epi_movimentacoes.findMany({
      where,
      select: SELECT_MOV_DETALHE,
      take: 200,
      orderBy: { data_movimentacao: 'desc' },
    }) as any
  }

  async createMovimentacaoHistorica(data: {
    colaborador_id: number
    epi_id: number
    quantidade: number
    data_movimentacao: string
    responsavel: string
    proxima_entrega?: string
    motivo?: string
    observacoes?: string
    empresaId?: number
  }) {
    const epi = await this.prisma.epis.findUniqueOrThrow({
      where: { id: data.epi_id },
    })
    const dataMovimentacao = new Date(data.data_movimentacao)
    let proximaEntrega: Date
    if (data.proxima_entrega) {
      proximaEntrega = new Date(data.proxima_entrega)
    } else {
      proximaEntrega = new Date(dataMovimentacao)
      proximaEntrega.setDate(proximaEntrega.getDate() + epi.vida_util_dias)
    }
    return this.prisma.epi_movimentacoes.create({
      data: {
        colaborador_id: data.colaborador_id,
        epi_id: data.epi_id,
        tipo: 'ENTREGA' as any,
        quantidade: data.quantidade,
        data_movimentacao: dataMovimentacao,
        responsavel: data.responsavel,
        proxima_entrega: proximaEntrega,
        motivo: data.motivo,
        observacoes: data.observacoes ?? 'Entrega histórica',
        empresaId: data.empresaId,
      },
    })
  }

  findMovimentacoesByColaborador(colaboradorId: number) {
    return this.prisma.epi_movimentacoes.findMany({
      where: { colaborador_id: colaboradorId },
      select: SELECT_MOV_DETALHE,
      orderBy: { data_movimentacao: 'desc' },
    }) as any
  }

  async createMovimentacao(data: CriarMovimentacaoEpiDto) {
    const tipoUpper = data.tipo.toUpperCase()
    const isDevolucao = tipoUpper === 'DEVOLUCAO'
    const isBaixa = tipoUpper === 'BAIXA'
    const isDecrement = !isDevolucao && !isBaixa

    const epi = await this.prisma.epis.findUniqueOrThrow({
      where: { id: data.epi_id },
    })

    if (isDecrement && epi.estoque_atual < data.quantidade) {
      throw new Error(
        `Estoque insuficiente. Disponível: ${epi.estoque_atual}, solicitado: ${data.quantidade}`,
      )
    }

    const dataMovimentacao = new Date(data.data_movimentacao)
    let proximaEntrega: Date | null = null

    if (tipoUpper === 'ENTREGA' || tipoUpper === 'TROCA') {
      if (data.proxima_entrega) {
        proximaEntrega = new Date(data.proxima_entrega)
      } else {
        proximaEntrega = new Date(dataMovimentacao)
        proximaEntrega.setDate(proximaEntrega.getDate() + epi.vida_util_dias)
      }
    }

    const obsDefault = isDevolucao
      ? 'Devolução do colaborador'
      : `Entrega ao colaborador (${tipoUpper})`

    return this.prisma.$transaction(async (tx) => {
      const mov = await tx.epi_movimentacoes.create({
        data: {
          colaborador_id: data.colaborador_id,
          epi_id: data.epi_id,
          tipo: tipoUpper as any,
          quantidade: data.quantidade,
          data_movimentacao: dataMovimentacao,
          responsavel: data.responsavel,
          proxima_entrega: proximaEntrega,
          motivo: data.motivo,
          observacoes: data.observacoes ?? obsDefault,
          empresaId: data.empresaId,
        },
      })

      if (!isBaixa) {
        const estoqueType = isDevolucao ? 'DEVOLUCAO' : 'SAIDA'
        await tx.epi_estoque_movimentacoes.create({
          data: {
            epi_id: data.epi_id,
            tipo: estoqueType as any,
            quantidade: data.quantidade,
            data_movimentacao: dataMovimentacao,
            responsavel: data.responsavel,
            observacoes: mov.observacoes,
            empresaId: data.empresaId,
          },
        })

        if (isDevolucao) {
          await tx.epis.update({
            where: { id: data.epi_id },
            data: { estoque_atual: { increment: data.quantidade } },
          })
        } else {
          await tx.epis.update({
            where: { id: data.epi_id },
            data: { estoque_atual: { decrement: data.quantidade } },
          })
        }

        if (data.empresaId) {
          const filialDelta = isDevolucao ? data.quantidade : -data.quantidade
          await upsertFilial(tx, data.epi_id, data.empresaId, filialDelta)
        }
      }

      return mov
    })
  }

  // ── Estoque ───────────────────────────────────────────────────────────────

  async findEstoque(filters?: { epi_id?: number; empresaId?: number }) {
    const epiWhere: Record<string, unknown> = { status: 'ATIVO' }
    const movWhere: Record<string, unknown> = {}
    if (filters?.epi_id) {
      epiWhere.id = filters.epi_id
      movWhere.epi_id = filters.epi_id
    }
    if (filters?.empresaId) movWhere.empresaId = filters.empresaId

    const [episRaw, movimentacoes] = await Promise.all([
      this.prisma.epis.findMany({ where: epiWhere, orderBy: { nome: 'asc' } }),
      this.prisma.epi_estoque_movimentacoes.findMany({
        where: movWhere,
        include: { epi: { select: { nome: true } } },
        orderBy: { data_movimentacao: 'desc' },
        take: 200,
      }),
    ])

    const epis = episRaw.map((e) => ({
      ...e,
      situacao: (e.estoque_atual <= 0
        ? 'zerado'
        : e.estoque_atual <= e.estoque_minimo
          ? 'baixo'
          : 'ok') as 'ok' | 'baixo' | 'zerado',
    }))

    return { epis, movimentacoes }
  }

  async createEstoqueMovimentacao(data: CriarMovimentacaoEstoqueDto) {
    const tipoUpper = data.tipo.toUpperCase()
    const delta = calcDelta(tipoUpper, data.quantidade)
    const epi = await this.prisma.epis.findUniqueOrThrow({
      where: { id: data.epi_id },
    })

    if (delta < 0 && epi.estoque_atual + delta < 0) {
      throw new Error(
        `Estoque insuficiente. Disponível: ${epi.estoque_atual}, operação: ${delta}`,
      )
    }

    return this.prisma.$transaction(async (tx) => {
      const mov = await tx.epi_estoque_movimentacoes.create({
        data: {
          epi_id: data.epi_id,
          tipo: tipoUpper as any,
          quantidade: data.quantidade,
          data_movimentacao: data.data_movimentacao
            ? new Date(data.data_movimentacao)
            : new Date(),
          responsavel: data.responsavel,
          observacoes: data.observacoes,
          empresaId: data.empresaId,
        },
      })

      await tx.epis.update({
        where: { id: data.epi_id },
        data: { estoque_atual: Math.max(0, epi.estoque_atual + delta) },
      })

      if (data.empresaId) {
        await upsertFilial(tx, data.epi_id, data.empresaId, delta)
      }

      return mov
    })
  }

  async updateEstoqueMovimentacao(
    id: number,
    data: Partial<CriarMovimentacaoEstoqueDto>,
  ) {
    const existing =
      await this.prisma.epi_estoque_movimentacoes.findUniqueOrThrow({
        where: { id },
      })
    const oldDelta = calcDelta(existing.tipo, existing.quantidade)
    const newTipo = data.tipo ? data.tipo.toUpperCase() : existing.tipo
    const newQtd = data.quantidade ?? existing.quantidade
    const newDelta = calcDelta(newTipo, newQtd)
    const diff = newDelta - oldDelta

    if (diff < 0) {
      const epi = await this.prisma.epis.findUniqueOrThrow({
        where: { id: existing.epi_id },
      })
      if (epi.estoque_atual + diff < 0)
        throw new Error('Estoque insuficiente para esta atualização')
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.epi_estoque_movimentacoes.update({
        where: { id },
        data: {
          ...(data.tipo && { tipo: data.tipo.toUpperCase() as any }),
          ...(data.quantidade !== undefined && { quantidade: data.quantidade }),
          ...(data.data_movimentacao && {
            data_movimentacao: new Date(data.data_movimentacao),
          }),
          ...(data.responsavel && { responsavel: data.responsavel }),
          ...(data.observacoes !== undefined && {
            observacoes: data.observacoes,
          }),
          ...(data.empresaId !== undefined && { empresaId: data.empresaId }),
        },
      })

      if (diff !== 0) {
        await tx.epis.update({
          where: { id: existing.epi_id },
          data: { estoque_atual: { increment: diff } },
        })
      }

      return updated
    })
  }

  async deleteEstoqueMovimentacao(id: number) {
    const existing =
      await this.prisma.epi_estoque_movimentacoes.findUniqueOrThrow({
        where: { id },
      })
    const delta = calcDelta(existing.tipo, existing.quantidade)

    await this.prisma.$transaction(async (tx) => {
      await tx.epi_estoque_movimentacoes.delete({ where: { id } })
      await tx.epis.update({
        where: { id: existing.epi_id },
        data: { estoque_atual: { increment: -delta } },
      })
    })
  }

  // ── Saldo filiais ─────────────────────────────────────────────────────────

  async findSaldoFiliais(empresaId?: number) {
    const [episRaw, empresasRaw, saldosRaw] = await Promise.all([
      this.prisma.epis.findMany({
        where: { status: 'ATIVO' },
        select: {
          id: true,
          codigo: true,
          nome: true,
          categoria: true,
          estoque_minimo: true,
          estoque_atual: true,
        },
        orderBy: { nome: 'asc' },
      }),
      this.prisma.empresas.findMany({
        where: { oculto: false, ...(empresaId && { id: empresaId }) },
        select: { id: true, nomeEmpresa: true, numero: true, cidade: true },
        orderBy: { nomeEmpresa: 'asc' },
      }),
      this.prisma.$queryRawUnsafe<
        { epi_id: number; empresaId: number; saldo: string }[]
      >(`
        SELECT epi_id, empresaId,
          SUM(CASE
            WHEN tipo IN ('ENTRADA','DEVOLUCAO') THEN quantidade
            WHEN tipo IN ('SAIDA','PERDA') THEN -quantidade
            WHEN tipo = 'AJUSTE' THEN quantidade
            ELSE 0
          END) AS saldo
        FROM epi_estoque_movimentacoes
        WHERE empresaId IS NOT NULL${empresaId ? ` AND empresaId = ${empresaId}` : ''}
        GROUP BY epi_id, empresaId
      `),
    ])

    const saldos: Record<number, Record<number, number>> = {}
    for (const row of saldosRaw) {
      if (!saldos[row.epi_id]) saldos[row.epi_id] = {}
      saldos[row.epi_id][row.empresaId] = Number(row.saldo)
    }

    return {
      produtos: episRaw.map((e) => ({
        id: e.id,
        codigoInterno: e.codigo,
        nome: e.nome,
        categoria: e.categoria,
        unidade: 'un',
        estoqueMinimo: e.estoque_minimo,
        estoqueAtual: e.estoque_atual,
      })),
      empresas: empresasRaw,
      saldos,
    }
  }

  // ── Misc ──────────────────────────────────────────────────────────────────

  findEmpresas() {
    return this.prisma.empresas.findMany({
      where: { oculto: false },
      select: { id: true, nomeEmpresa: true, cnpj: true, cidade: true },
      orderBy: { nomeEmpresa: 'asc' },
    })
  }

  async findResponsaveis() {
    const users = await this.prisma.users.findMany({
      where: {
        oculto: false,
        OR: [{ role: 'ADMIN' }, { permissions_json: { contains: '"epi"' } }],
      },
      select: { id: true, nome: true, sobrenome: true },
      orderBy: { nome: 'asc' },
    })
    return users.map((u) => ({
      id: u.id,
      nome: `${u.nome} ${u.sobrenome}`.trim(),
    }))
  }

  async findDashboard(empresaId?: number) {
    const hoje = new Date()
    const seteD = new Date()
    seteD.setDate(hoje.getDate() + 7)
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

    const base = empresaId ? { empresaId } : {}

    const [
      totalColabs,
      totalEpis,
      vencidos,
      proximos,
      estoqueBaixo,
      entregasMes,
      ultimasMovs,
    ] = await Promise.all([
      this.prisma.colaboradores.count({ where: { oculto: false } }),
      this.prisma.epis.count({ where: { status: 'ATIVO' } }),
      this.prisma.epi_movimentacoes.count({
        where: { ...base, tipo: 'ENTREGA', proxima_entrega: { lt: hoje } },
      }),
      this.prisma.epi_movimentacoes.count({
        where: {
          ...base,
          tipo: 'ENTREGA',
          proxima_entrega: { gte: hoje, lte: seteD },
        },
      }),
      this.prisma.epis.count({
        where: {
          status: 'ATIVO',
          estoque_atual: { lte: this.prisma.epis.fields.estoque_minimo as any },
        },
      }),
      this.prisma.epi_movimentacoes.count({
        where: { ...base, createdAt: { gte: inicioMes } },
      }),
      this.prisma.epi_movimentacoes.findMany({
        where: base,
        select: SELECT_MOV_DETALHE,
        take: 6,
        orderBy: { data_movimentacao: 'desc' },
      }),
    ])

    return {
      totalColaboradores: totalColabs,
      totalEpis,
      alertasVencidos: vencidos,
      alertasProximos: proximos,
      estoqueBaixo,
      entregasMes,
      ultimasMovimentacoes: ultimasMovs as any,
    }
  }

  async findAlertas(empresaId?: number) {
    const hoje = new Date()
    const seteD = new Date()
    seteD.setDate(hoje.getDate() + 7)
    const base = empresaId ? { empresaId } : {}

    const [vencidos, proximos, estoqueBaixoRaw] = await Promise.all([
      this.prisma.epi_movimentacoes.findMany({
        where: { ...base, tipo: 'ENTREGA', proxima_entrega: { lt: hoje } },
        select: SELECT_MOV_DETALHE,
        orderBy: { proxima_entrega: 'asc' },
      }),
      this.prisma.epi_movimentacoes.findMany({
        where: {
          ...base,
          tipo: 'ENTREGA',
          proxima_entrega: { gte: hoje, lte: seteD },
        },
        select: SELECT_MOV_DETALHE,
        orderBy: { proxima_entrega: 'asc' },
      }),
      this.prisma.epis.findMany({
        where: {
          status: 'ATIVO',
          estoque_atual: { lte: this.prisma.epis.fields.estoque_minimo as any },
        },
        orderBy: { nome: 'asc' },
      }),
    ])

    const estoqueBaixo = estoqueBaixoRaw.map((e) => ({
      ...e,
      situacao: (e.estoque_atual <= 0 ? 'zerado' : 'baixo') as
        | 'ok'
        | 'baixo'
        | 'zerado',
    }))

    return {
      vencidos: vencidos as any,
      proximos: proximos as any,
      estoqueBaixo,
      total: vencidos.length + proximos.length + estoqueBaixo.length,
    }
  }

  // ── Transferências ────────────────────────────────────────────────────────

  async findTransferencias(filters?: {
    page?: number
    limit?: number
    dataInicio?: string
    dataFim?: string
  }) {
    const page = filters?.page ?? 1
    const limit = filters?.limit ?? 20
    const where: Record<string, unknown> = {}
    if (filters?.dataInicio || filters?.dataFim) {
      where.dataTransferencia = {
        ...(filters.dataInicio && { gte: new Date(filters.dataInicio) }),
        ...(filters.dataFim && { lte: new Date(filters.dataFim) }),
      }
    }

    const [total, rows] = await Promise.all([
      this.prisma.epi_transferencias.count({ where }),
      this.prisma.epi_transferencias.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { dataTransferencia: 'desc' },
      }),
    ])

    const epiIds = [...new Set(rows.map((r) => r.epiId))]
    const empIds = [
      ...new Set(rows.flatMap((r) => [r.empresaOrigemId, r.empresaDestinoId])),
    ]

    const [episMap, empMap] = await Promise.all([
      this.prisma.epis.findMany({
        where: { id: { in: epiIds } },
        select: { id: true, nome: true, codigo: true, categoria: true },
      }),
      this.prisma.empresas.findMany({
        where: { id: { in: empIds } },
        select: { id: true, nomeEmpresa: true },
      }),
    ])

    const eMap = Object.fromEntries(episMap.map((e) => [e.id, e]))
    const cMap = Object.fromEntries(empMap.map((e) => [e.id, e]))

    const data = rows.map((r) => ({
      ...r,
      produtoId: r.epiId,
      produto: eMap[r.epiId] ?? null,
      empresaOrigem: cMap[r.empresaOrigemId] ?? null,
      empresaDestino: cMap[r.empresaDestinoId] ?? null,
    }))

    return { data, total, pages: Math.ceil(total / limit), page }
  }

  async createTransferencia(data: CriarTransferenciaEpiDto) {
    const saldosRaw = await this.prisma.$queryRawUnsafe<{ saldo: string }[]>(`
      SELECT SUM(CASE
        WHEN tipo IN ('ENTRADA','DEVOLUCAO') THEN quantidade
        WHEN tipo IN ('SAIDA','PERDA') THEN -quantidade
        WHEN tipo = 'AJUSTE' THEN quantidade
        ELSE 0
      END) AS saldo
      FROM epi_estoque_movimentacoes
      WHERE epi_id = ${data.produtoId} AND empresaId = ${data.empresaOrigemId}
    `)

    const saldoOrigem = Number(saldosRaw[0]?.saldo ?? 0)
    if (saldoOrigem < data.quantidade) {
      throw new Error(
        `Saldo insuficiente na filial origem. Disponível: ${saldoOrigem}, solicitado: ${data.quantidade}`,
      )
    }

    const [empresaOrigem, empresaDestino] = await Promise.all([
      this.prisma.empresas.findUnique({
        where: { id: data.empresaOrigemId },
        select: { nomeEmpresa: true },
      }),
      this.prisma.empresas.findUnique({
        where: { id: data.empresaDestinoId },
        select: { nomeEmpresa: true },
      }),
    ])

    const dataTransf = new Date(data.dataTransferencia)

    return this.prisma.$transaction(async (tx) => {
      const saida = await tx.epi_estoque_movimentacoes.create({
        data: {
          epi_id: data.produtoId,
          tipo: 'SAIDA' as any,
          quantidade: data.quantidade,
          data_movimentacao: dataTransf,
          responsavel: data.responsavel,
          observacoes: `Transferência para ${empresaDestino?.nomeEmpresa ?? data.empresaDestinoId}`,
          empresaId: data.empresaOrigemId,
        },
      })

      const entrada = await tx.epi_estoque_movimentacoes.create({
        data: {
          epi_id: data.produtoId,
          tipo: 'ENTRADA' as any,
          quantidade: data.quantidade,
          data_movimentacao: dataTransf,
          responsavel: data.responsavel,
          observacoes: `Transferência recebida de ${empresaOrigem?.nomeEmpresa ?? data.empresaOrigemId}`,
          empresaId: data.empresaDestinoId,
        },
      })

      const transf = await tx.epi_transferencias.create({
        data: {
          epiId: data.produtoId,
          empresaOrigemId: data.empresaOrigemId,
          empresaDestinoId: data.empresaDestinoId,
          quantidade: data.quantidade,
          dataTransferencia: dataTransf,
          responsavel: data.responsavel,
          observacoes: data.observacoes,
          saidaId: saida.id,
          entradaId: entrada.id,
        },
      })

      return {
        ...transf,
        produtoId: transf.epiId,
        produto: await tx.epis.findUnique({
          where: { id: data.produtoId },
          select: { nome: true, codigo: true, categoria: true },
        }),
        empresaOrigem,
        empresaDestino,
      }
    })
  }

  async deleteTransferencia(id: number) {
    const transf = await this.prisma.epi_transferencias.findUniqueOrThrow({
      where: { id },
    })

    await this.prisma.$transaction(async (tx) => {
      if (transf.saidaId) {
        await tx.epi_estoque_movimentacoes
          .delete({ where: { id: transf.saidaId } })
          .catch(() => null)
      }
      if (transf.entradaId) {
        await tx.epi_estoque_movimentacoes
          .delete({ where: { id: transf.entradaId } })
          .catch(() => null)
      }
      await tx.epi_transferencias.delete({ where: { id } })
    })
  }
}
