import { Injectable } from '@nestjs/common'
import type {
  ColaboradorAuth,
  ColaboradorRow,
  CreateCargoUniformeData,
  CreateMovimentacaoData,
  CreateUniformeData,
  EmpresaSimples,
  GestorEmpresaRow,
  ListColaboradoresFilters,
  ListMovimentacoesFilters,
  MovimentacaoRow,
  ResponsavelRow,
  UniformeRepository,
  UniformeRow,
  UpdateColaboradorData,
  UpdateUniformeData,
} from '../../../../domain/uniforme/application/repositories/uniforme-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

const COLABORADOR_SELECT = {
  id: true,
  nome: true,
  sobrenome: true,
  numeroEmpresa: true,
  epiCargoId: true,
  cargo: true,
  setor: true,
  oculto: true,
  demissao: true,
  admissao: true,
  empresaId: true,
  isGestor: true,
  epiObservacoes: true,
  empresa: { select: { id: true, nomeEmpresa: true, cnpj: true } },
  gestoresRelacao: {
    select: { gestor: { select: { id: true, nome: true, sobrenome: true } } },
  },
} as const

@Injectable()
export class PrismaUniformeRepository implements UniformeRepository {
  constructor(private prisma: PrismaService) {}

  // ── uniformes ────────────────────────────────────────────────
  listUniformes(): Promise<UniformeRow[]> {
    return this.prisma.uniformes.findMany({ orderBy: { nome: 'asc' } })
  }

  findUniformeById(id: number) {
    return this.prisma.uniformes.findUnique({ where: { id } })
  }

  findUniformeByCodigo(codigo: string) {
    return this.prisma.uniformes.findUnique({ where: { codigo } })
  }

  createUniforme(data: CreateUniformeData): Promise<UniformeRow> {
    return this.prisma.uniformes.create({ data })
  }

  updateUniforme(id: number, data: UpdateUniformeData): Promise<UniformeRow> {
    return this.prisma.uniformes.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    })
  }

  // ── departamentos (epi_cargos tipo = departamento) ───────────
  listDepartamentos() {
    return this.prisma.epi_cargos.findMany({
      where: { tipo: 'departamento' },
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true, descricao: true, tipo: true },
    })
  }

  createDepartamento(nome: string, descricao: string | null) {
    return this.prisma.epi_cargos.create({
      data: { nome, descricao, tipo: 'departamento' },
      select: { id: true, nome: true, descricao: true, tipo: true },
    })
  }

  countVinculosByCargo(cargoId: number) {
    return this.prisma.uniforme_cargo_obrigatorio.count({
      where: { cargo_id: cargoId },
    })
  }

  async deleteDepartamento(id: number) {
    await this.prisma.epi_cargos.delete({ where: { id } })
  }

  // ── cargo-uniforme ───────────────────────────────────────────
  listCargoUniforme() {
    return this.prisma.uniforme_cargo_obrigatorio.findMany({
      orderBy: { cargo_id: 'asc' },
      select: {
        id: true,
        cargo_id: true,
        uniforme_id: true,
        periodicidade_troca_dias: true,
        quantidade_padrao: true,
        obrigatorio: true,
      },
    })
  }

  createCargoUniforme(data: CreateCargoUniformeData) {
    return this.prisma.uniforme_cargo_obrigatorio.create({
      data,
      select: {
        id: true,
        cargo_id: true,
        uniforme_id: true,
        periodicidade_troca_dias: true,
        quantidade_padrao: true,
        obrigatorio: true,
      },
    })
  }

  async deleteCargoUniforme(id: number) {
    await this.prisma.uniforme_cargo_obrigatorio.delete({ where: { id } })
  }

  // ── colaboradores ────────────────────────────────────────────
  findUserAuth(userId: string) {
    return this.prisma.users.findUnique({
      where: { id: userId },
      select: { role: true, cpf: true },
    })
  }

  findGestorColaboradorByUserId(userId: string) {
    return this.prisma.colaboradores.findFirst({
      where: { userId, isGestor: true },
      select: { id: true, isGestor: true },
    })
  }

  findColaboradorByUserId(userId: string) {
    return this.prisma.colaboradores.findFirst({
      where: { userId },
      select: { id: true, isGestor: true },
    })
  }

  async findGestorByCpf(cpf: string): Promise<ColaboradorAuth | null> {
    const cpfLimpo = cpf.replace(/\D/g, '')
    const gestores = await this.prisma.colaboradores.findMany({
      where: { isGestor: true },
      select: { id: true, isGestor: true, cpf: true },
    })
    const match = gestores.find(
      (g) => g.cpf && g.cpf.replace(/\D/g, '') === cpfLimpo,
    )
    return match ? { id: match.id, isGestor: match.isGestor } : null
  }

  listColaboradores(
    filters: ListColaboradoresFilters,
  ): Promise<ColaboradorRow[]> {
    const where: Record<string, unknown> = {}
    if (filters.empresaId) where.empresaId = filters.empresaId
    if (filters.status === 'ativo') where.oculto = false
    if (filters.status === 'inativo') where.oculto = true
    if (filters.gestorId)
      where.gestoresRelacao = { some: { gestorId: filters.gestorId } }

    return this.prisma.colaboradores.findMany({
      where,
      select: COLABORADOR_SELECT,
      orderBy: { nome: 'asc' },
    })
  }

  async updateColaborador(id: number, data: UpdateColaboradorData) {
    const colaborador = await this.prisma.colaboradores.update({
      where: { id },
      data,
      select: { id: true, epiCargoId: true },
    })
    return colaborador
  }

  listGestorEmpresas(colaboradorId: number): Promise<GestorEmpresaRow[]> {
    return this.prisma.gestor_empresas.findMany({
      where: { colaboradorId },
      select: { empresaId: true, empresa: { select: { nomeEmpresa: true } } },
    })
  }

  // ── movimentacoes ────────────────────────────────────────────
  listMovimentacoes(
    filters: ListMovimentacoesFilters,
  ): Promise<MovimentacaoRow[]> {
    const where: Record<string, unknown> = {}
    if (filters.colaboradorId) where.colaborador_id = filters.colaboradorId
    if (filters.uniformeId) where.uniforme_id = filters.uniformeId
    if (filters.tipo) where.tipo = filters.tipo
    if (filters.empresaId) where.empresaId = filters.empresaId

    return this.prisma.uniforme_movimentacoes.findMany({
      where,
      orderBy: { data_movimentacao: 'desc' },
      take: 200,
      select: {
        id: true,
        colaborador_id: true,
        uniforme_id: true,
        tipo: true,
        quantidade: true,
        data_movimentacao: true,
        responsavel: true,
        proxima_entrega: true,
        motivo: true,
        observacoes: true,
      },
    })
  }

  createMovimentacao(data: CreateMovimentacaoData): Promise<MovimentacaoRow> {
    return this.prisma.$transaction(async (tx) => {
      const mov = await tx.uniforme_movimentacoes.create({
        data: {
          colaborador_id: data.colaborador_id,
          uniforme_id: data.uniforme_id,
          tipo: data.tipo,
          quantidade: data.quantidade,
          data_movimentacao: data.data_movimentacao,
          responsavel: data.responsavel,
          proxima_entrega: data.proxima_entrega,
          motivo: data.motivo,
          observacoes: data.observacoes,
          empresaId: data.empresaId,
        },
        select: {
          id: true,
          colaborador_id: true,
          uniforme_id: true,
          tipo: true,
          quantidade: true,
          data_movimentacao: true,
          responsavel: true,
          proxima_entrega: true,
          motivo: true,
          observacoes: true,
        },
      })

      if (data.tipo !== 'BAIXA') {
        const isDevolucao = data.tipo === 'DEVOLUCAO'
        await tx.uniformes.update({
          where: { id: data.uniforme_id },
          data: {
            estoque_atual: isDevolucao
              ? { increment: data.quantidade }
              : { decrement: data.quantidade },
            updatedAt: new Date(),
          },
        })
      }

      return mov
    })
  }

  // ── shared ───────────────────────────────────────────────────
  listEmpresas(): Promise<EmpresaSimples[]> {
    return this.prisma.empresas.findMany({
      where: { oculto: false },
      orderBy: { nomeEmpresa: 'asc' },
      select: { id: true, nomeEmpresa: true, cnpj: true, cidade: true },
    })
  }

  async listResponsaveis(): Promise<ResponsavelRow[]> {
    const uniPerms = await this.prisma.permission.findMany({
      where: { page: 'uniforme', canAccess: true },
      select: { userId: true },
    })
    const idsComPermissao = uniPerms.map((p) => p.userId)

    const users = await this.prisma.users.findMany({
      where: {
        oculto: false,
        OR: [{ role: 'ADMIN' }, { id: { in: idsComPermissao } }],
      },
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true, sobrenome: true },
    })

    return users.map((u) => ({
      id: u.id,
      nome: [u.nome, u.sobrenome].filter(Boolean).join(' '),
    }))
  }
}
