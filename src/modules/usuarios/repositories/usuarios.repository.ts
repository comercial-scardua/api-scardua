import type { AtualizarUsuarioDto } from '../dto/atualizar-usuario.dto';
import type { CriarUsuarioDto } from '../dto/criar-usuario.dto';

export type SafeUser = {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  role: string;
  setor: string | null;
  ramal: string | null;
  isTecnico: boolean;
  foto: string | null;
  especialidades: string | null;
  oculto: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export abstract class UsuariosRepository {
  abstract findAll(filters?: {
    setor?: string;
    role?: string;
    oculto?: boolean;
  }): Promise<SafeUser[]>;
  abstract findById(id: string): Promise<SafeUser | null>;
  abstract findByEmail(email: string): Promise<SafeUser | null>;
  abstract findByCpf(cpf: string): Promise<SafeUser | null>;
  abstract create(
    data: CriarUsuarioDto & { passwordHash: string; id: string },
  ): Promise<SafeUser>;
  abstract update(id: string, data: AtualizarUsuarioDto): Promise<SafeUser>;
  abstract softDelete(id: string): Promise<SafeUser>;
}
