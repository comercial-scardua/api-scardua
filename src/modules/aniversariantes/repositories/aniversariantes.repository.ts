export type ColaboradorAniversariante = {
  id: number;
  nome: string | null;
  sobrenome: string | null;
  dataNascimento: Date;
  empresa: string | null;
};

export abstract class AniversariantesRepository {
  abstract findColaboradoresComNascimento(): Promise<
    ColaboradorAniversariante[]
  >;
}
