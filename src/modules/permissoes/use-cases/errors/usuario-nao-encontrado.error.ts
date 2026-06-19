export class UsuarioNaoEncontradoError extends Error {
  constructor(userId: string) {
    super(`Usuário "${userId}" não encontrado`)
    this.name = 'UsuarioNaoEncontradoError'
  }
}
