import { Injectable } from '@nestjs/common';
import { AniversariantesRepository } from '../repositories/aniversariantes.repository';

export type Aniversariante = {
  id: number;
  nome: string;
  sobrenome: string;
  dataNascimento: Date;
  empresa?: string;
  idade: number;
  diasParaAniversario: number;
};

@Injectable()
export class ListarAniversariantesUseCase {
  constructor(private repo: AniversariantesRepository) {}

  async execute(mes?: number): Promise<Aniversariante[]> {
    const colaboradores = await this.repo.findColaboradoresComNascimento();

    const hoje = new Date();
    const mesFiltro = mes ?? hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    return colaboradores
      .filter((c) => c.dataNascimento.getMonth() + 1 === mesFiltro)
      .map((c) => {
        const nascimento = c.dataNascimento;

        let proximoAniversario = new Date(
          anoAtual,
          nascimento.getMonth(),
          nascimento.getDate(),
        );
        if (proximoAniversario < hoje) {
          proximoAniversario = new Date(
            anoAtual + 1,
            nascimento.getMonth(),
            nascimento.getDate(),
          );
        }

        const diffTime = proximoAniversario.getTime() - hoje.getTime();
        const diasParaAniversario = Math.max(
          0,
          Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
        );

        return {
          id: c.id,
          nome: c.nome ?? '',
          sobrenome: c.sobrenome ?? '',
          dataNascimento: nascimento,
          empresa: c.empresa ?? undefined,
          idade: proximoAniversario.getFullYear() - nascimento.getFullYear(),
          diasParaAniversario,
        };
      })
      .sort((a, b) => a.diasParaAniversario - b.diasParaAniversario);
  }
}
