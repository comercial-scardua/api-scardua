import type { AtualizarEmpresaDto } from '../dto/atualizar-empresa.dto';
import type { CriarEmpresaDto } from '../dto/criar-empresa.dto';

export type EmpresaSimples = {
  id: number;
  numero: string | null;
  nomeEmpresa: string;
  cnpj: string | null;
  cidade: string | null;
};

export type EmpresaCompleta = EmpresaSimples & {
  oculto: boolean;
  createdAt: Date;
  updatedAt: Date;
  criadoPor: { id: string; nome: string; email: string } | null;
  colaboradores: { id: number; nome: string | null; sobrenome: string | null }[];
};

export type ListaEmpresasResult = {
  data: EmpresaCompleta[];
  total: number;
  pages: number;
  page: number;
};

export abstract class EmpresasRepository {
  abstract findAll(filters: {
    searchTerm?: string;
    mostrarOcultos?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ListaEmpresasResult>;
  abstract findSimple(): Promise<EmpresaSimples[]>;
  abstract findById(id: number): Promise<EmpresaCompleta | null>;
  abstract findByCnpj(cnpj: string): Promise<EmpresaSimples | null>;
  abstract create(
    data: CriarEmpresaDto,
    criadoPorId: string,
  ): Promise<EmpresaCompleta>;
  abstract update(
    id: number,
    data: AtualizarEmpresaDto,
  ): Promise<EmpresaCompleta>;
  abstract softDelete(id: number): Promise<EmpresaCompleta>;
}
