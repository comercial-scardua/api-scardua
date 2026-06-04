import { Injectable } from '@nestjs/common';
import  { UsuariosRepository } from '../repositories/usuarios.repository';

@Injectable()
export class ListarUsuariosUseCase {
  constructor(private repo: UsuariosRepository) {}

  execute(filters?: { setor?: string; role?: string; oculto?: boolean }) {
    return this.repo.findAll(filters);
  }
}
