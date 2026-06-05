import type { contrato_arquivos, contratos } from '@prisma/client';
import type { AtualizarContratoDto } from '../dto/atualizar-contrato.dto';
import type { CriarContratoDto } from '../dto/criar-contrato.dto';

export type ContratoComArquivos = contratos & {
  arquivos: contrato_arquivos[];
};

export abstract class ContratosRepository {
  abstract findAll(): Promise<ContratoComArquivos[]>;
  abstract findById(id: number): Promise<ContratoComArquivos | null>;
  abstract findByNumero(numero: string): Promise<contratos | null>;
  abstract create(data: CriarContratoDto): Promise<contratos>;
  abstract update(id: number, data: AtualizarContratoDto): Promise<contratos>;
  abstract alternarStatus(id: number): Promise<contratos>;
  abstract renovar(id: number): Promise<contratos>;
  abstract excluir(id: number): Promise<void>;
  abstract adicionarArquivo(
    contratoId: number,
    arquivo: {
      nome_original: string;
      nome: string;
      caminho_arquivo: string;
      tipo_arquivo?: string;
      tamanho_arquivo?: number;
    },
  ): Promise<contrato_arquivos>;
  abstract removerArquivo(contratoId: number, arquivoId: number): Promise<contrato_arquivos | null>;
}
