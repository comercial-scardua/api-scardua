export class CodigoJaCadastradoError extends Error {
  constructor(codigo: string) {
    super(`Código interno "${codigo}" já está cadastrado`)
    this.name = 'CodigoJaCadastradoError'
  }
}
