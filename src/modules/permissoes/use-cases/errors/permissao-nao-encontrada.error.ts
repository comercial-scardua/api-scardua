export class PermissaoNaoEncontradaError extends Error {
  constructor(userId: string, page: string) {
    super(
      `Permissão da página "${page}" não encontrada para o usuário "${userId}"`,
    )
    this.name = 'PermissaoNaoEncontradaError'
  }
}
