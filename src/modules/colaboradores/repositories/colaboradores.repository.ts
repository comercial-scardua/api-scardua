import type { colaboradores } from '@prisma/client';
import type { CriarColaboradorDto } from '../dto/criar-colaborador.dto';

export abstract class ColaboradoresRepository {
  abstract findAll(filters: {
    cpf?: string;
    simple?: boolean;
  }): Promise<Partial<colaboradores>[]>;
  abstract findById(id: number): Promise<colaboradores | null>;
  abstract findByEmail(email: string): Promise<colaboradores | null>;
  abstract create(data: CriarColaboradorDto): Promise<colaboradores>;
  abstract update(
    id: number,
    data: Partial<CriarColaboradorDto>,
  ): Promise<colaboradores>;
  abstract softDelete(id: number): Promise<colaboradores>;
}
