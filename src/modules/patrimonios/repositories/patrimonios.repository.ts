import type { patrimonios } from '@prisma/client';
import type { AtualizarPatrimonioDto } from '../dto/atualizar-patrimonio.dto';
import type { CriarPatrimonioDto } from '../dto/criar-patrimonio.dto';

export type PatrimonioCompleto = patrimonios & {
  responsavel: {
    id: number;
    nome: string | null;
    sobrenome: string | null;
    cargo: string | null;
    setor: string | null;
  } | null;
  movimentacoes: Array<{
    id: number;
    tipo: string;
    createdAt: Date;
    autor: { id: number; nome: string | null; sobrenome: string | null } | null;
    responsavelNovo: { id: number; nome: string | null; sobrenome: string | null } | null;
    responsavelAnterior: { id: number; nome: string | null; sobrenome: string | null } | null;
  }>;
};

export abstract class PatrimoniosRepository {
  abstract findAll(showHidden?: boolean): Promise<PatrimonioCompleto[]>;
  abstract findById(id: number): Promise<PatrimonioCompleto | null>;
  abstract findVeiculos(): Promise<
    { id: number; nome: string; modelo: string; placa: string }[]
  >;
  abstract findBySerial(serial: string, skipId?: number): Promise<{ id: number; nome: string; tipo: string } | null>;
  abstract stats(): Promise<{
    porTipo: Record<string, number>;
    porSetor: Record<string, number>;
    movimentacoesPorMes: Record<string, number>;
  }>;
  abstract create(data: CriarPatrimonioDto): Promise<patrimonios>;
  abstract update(id: number, data: AtualizarPatrimonioDto): Promise<patrimonios>;
  abstract criarMovimentacao(data: {
    patrimonioId: number;
    tipo: string;
    autorId?: number | null;
    responsavelAnteriorId?: number | null;
    responsavelNovoId?: number | null;
    localizacaoAnterior?: string | null;
    localizacaoNova?: string | null;
    kmAnterior?: string | null;
    kmNovo?: string | null;
  }): Promise<void>;
  abstract toggleOculto(id: number): Promise<patrimonios>;
}
