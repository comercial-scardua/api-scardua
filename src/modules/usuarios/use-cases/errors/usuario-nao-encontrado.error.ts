export class UsuarioNaoEncontradoError extends Error {
  constructor(id: string) {
    super(`Usuário "${id}" não encontrado`);
    this.name = 'UsuarioNaoEncontradoError';
  }
}
