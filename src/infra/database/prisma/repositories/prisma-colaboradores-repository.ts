import { Injectable } from '@nestjs/common'
import type { colaboradores } from '@prisma/client'
import type {
  CreateColaboradorData,
  UpdateColaboradorData,
} from '../../../../domain/colaboradores/application/dtos/colaborador-schema'
import { type ColaboradoresRepository } from '../../../../domain/colaboradores/application/repositories/colaboradores-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

// Relações escopadas — alinhado ao retorno do portal-scardua.
const COLABORADOR_INCLUDE = {
  empresa: { select: { id: true, nomeEmpresa: true, numero: true } },
  horarioTrabalho: true,
  patrimonios: {
    where: { oculto: false },
    select: {
      id: true,
      nome: true,
      status: true,
      tipo: true,
      localizacao: true,
      fabricante: true,
      numeroSerie: true,
      placa: true,
      valor: true,
      numeroNotaFiscal: true,
      dataNotaFiscal: true,
      dataGarantia: true,
      oculto: true,
    },
  },
} as const

@Injectable()
export class PrismaColaboradoresRepository implements ColaboradoresRepository {
  constructor(private prisma: PrismaService) {}

  findAll({ cpf, simple }: { cpf?: string; simple?: boolean }) {
    const normalizedCpf = cpf?.replace(/\D/g, '')
    const where = normalizedCpf ? { cpf: normalizedCpf } : { oculto: false }

    if (simple) {
      return this.prisma.colaboradores.findMany({
        where,
        select: {
          id: true,
          nome: true,
          sobrenome: true,
          cpf: true,
          identidade: true,
        },
        orderBy: { nome: 'asc' },
      })
    }

    return this.prisma.colaboradores.findMany({
      where,
      include: COLABORADOR_INCLUDE,
      orderBy: { nome: 'asc' },
    })
  }

  findById(id: number) {
    return this.prisma.colaboradores.findUnique({
      where: { id },
      include: COLABORADOR_INCLUDE,
    })
  }

  findByCpf(cpf: string) {
    const normalized = cpf.replace(/\D/g, '')
    return this.prisma.colaboradores.findUnique({ where: { cpf: normalized } })
  }

  findByUserId(userId: string) {
    return this.prisma.colaboradores.findFirst({
      where: { userId },
      include: COLABORADOR_INCLUDE,
    })
  }

  findTermos(colaboradorId: number) {
    return this.prisma.termos_assinados.findMany({
      where: { colaboradorId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(data: CreateColaboradorData): Promise<colaboradores> {
    const {
      horaInicio,
      horaFim,
      intervaloAlmoco,
      trabalhaSegunda,
      trabalhaTerca,
      trabalhaQuarta,
      trabalhaQuinta,
      trabalhaSexa,
      trabalhaSabado,
      trabalhaDomingo,
      cpf: rawCpf,
      admissao,
      demissao,
      cnhVencimento,
      dataNascimento,
      ...rest
    } = data

    const normalizedCpf = rawCpf?.replace(/\D/g, '')
    const hasHorario = !!(horaInicio || horaFim)

    const colaborador = await this.prisma.colaboradores.create({
      data: {
        ...rest,
        cpf: normalizedCpf,
        admissao: admissao ? new Date(admissao) : undefined,
        demissao: demissao ? new Date(demissao) : undefined,
        cnhVencimento: cnhVencimento ? new Date(cnhVencimento) : undefined,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
        updatedAt: new Date(),
        horarioTrabalho: hasHorario
          ? {
              create: {
                horaInicio: horaInicio ?? '07:30',
                horaFim: horaFim ?? '17:30',
                intervaloAlmo_o: intervaloAlmoco ?? 66,
                trabalhaSegunda: trabalhaSegunda ?? true,
                trabalhaTerca: trabalhaTerca ?? true,
                trabalhaQuarta: trabalhaQuarta ?? true,
                trabalhaQuinta: trabalhaQuinta ?? true,
                trabalhaSexa: trabalhaSexa ?? true,
                trabalhaSabado: trabalhaSabado ?? false,
                trabalhaDomingo: trabalhaDomingo ?? false,
                updatedAt: new Date(),
              },
            }
          : undefined,
      },
    })

    // Vínculo automático: se existir user com mesmo CPF, liga os dois.
    if (normalizedCpf && !colaborador.userId) {
      const formatted = `${normalizedCpf.slice(0, 3)}.${normalizedCpf.slice(3, 6)}.${normalizedCpf.slice(6, 9)}-${normalizedCpf.slice(9)}`
      const user = await this.prisma.users.findUnique({
        where: { cpf: formatted },
        select: { id: true },
      })
      if (user) {
        return this.prisma.colaboradores.update({
          where: { id: colaborador.id },
          data: { userId: user.id, updatedAt: new Date() },
        })
      }
    }

    return colaborador
  }

  async update(
    id: number,
    data: UpdateColaboradorData,
  ): Promise<colaboradores> {
    const {
      horaInicio,
      horaFim,
      intervaloAlmoco,
      trabalhaSegunda,
      trabalhaTerca,
      trabalhaQuarta,
      trabalhaQuinta,
      trabalhaSexa,
      trabalhaSabado,
      trabalhaDomingo,
      cpf: rawCpf,
      admissao,
      demissao,
      cnhVencimento,
      dataNascimento,
      ...rest
    } = data

    const normalizedCpf = rawCpf?.replace(/\D/g, '')
    const oculto =
      demissao !== undefined ? new Date(demissao) < new Date() : undefined

    const colaborador = await this.prisma.colaboradores.update({
      where: { id },
      data: {
        ...rest,
        ...(normalizedCpf !== undefined && { cpf: normalizedCpf }),
        ...(admissao !== undefined && { admissao: new Date(admissao) }),
        ...(demissao !== undefined && { demissao: new Date(demissao) }),
        ...(cnhVencimento !== undefined && {
          cnhVencimento: new Date(cnhVencimento),
        }),
        ...(dataNascimento !== undefined && {
          dataNascimento: new Date(dataNascimento),
        }),
        ...(oculto !== undefined && { oculto }),
        updatedAt: new Date(),
      },
    })

    // Sincroniza status oculto nos users com mesmo CPF.
    if (normalizedCpf && oculto !== undefined) {
      const formatted = `${normalizedCpf.slice(0, 3)}.${normalizedCpf.slice(3, 6)}.${normalizedCpf.slice(6, 9)}-${normalizedCpf.slice(9)}`
      await this.prisma.users.updateMany({
        where: { cpf: formatted },
        data: { oculto, updatedAt: new Date() },
      })
    }

    // Upsert horário de trabalho.
    const horarioFields = [
      horaInicio,
      horaFim,
      intervaloAlmoco,
      trabalhaSegunda,
      trabalhaTerca,
      trabalhaQuarta,
      trabalhaQuinta,
      trabalhaSexa,
      trabalhaSabado,
      trabalhaDomingo,
    ]
    if (horarioFields.some((v) => v !== undefined)) {
      await this.prisma.horarios_trabalho.upsert({
        where: { colaboradorId: id },
        update: {
          ...(horaInicio !== undefined && { horaInicio }),
          ...(horaFim !== undefined && { horaFim }),
          ...(intervaloAlmoco !== undefined && {
            intervaloAlmo_o: intervaloAlmoco,
          }),
          ...(trabalhaSegunda !== undefined && { trabalhaSegunda }),
          ...(trabalhaTerca !== undefined && { trabalhaTerca }),
          ...(trabalhaQuarta !== undefined && { trabalhaQuarta }),
          ...(trabalhaQuinta !== undefined && { trabalhaQuinta }),
          ...(trabalhaSexa !== undefined && { trabalhaSexa }),
          ...(trabalhaSabado !== undefined && { trabalhaSabado }),
          ...(trabalhaDomingo !== undefined && { trabalhaDomingo }),
          updatedAt: new Date(),
        },
        create: {
          colaboradorId: id,
          horaInicio: horaInicio ?? '07:30',
          horaFim: horaFim ?? '17:30',
          intervaloAlmo_o: intervaloAlmoco ?? 66,
          trabalhaSegunda: trabalhaSegunda ?? true,
          trabalhaTerca: trabalhaTerca ?? true,
          trabalhaQuarta: trabalhaQuarta ?? true,
          trabalhaQuinta: trabalhaQuinta ?? true,
          trabalhaSexa: trabalhaSexa ?? true,
          trabalhaSabado: trabalhaSabado ?? false,
          trabalhaDomingo: trabalhaDomingo ?? false,
          updatedAt: new Date(),
        },
      })
    }

    return colaborador
  }

  softDelete(id: number): Promise<colaboradores> {
    return this.prisma.colaboradores.update({
      where: { id },
      data: { oculto: true, updatedAt: new Date() },
    })
  }

  updateFoto(id: number, fotoUrl: string): Promise<colaboradores> {
    return this.prisma.colaboradores.update({
      where: { id },
      data: { foto: fotoUrl, updatedAt: new Date() },
    })
  }
}
