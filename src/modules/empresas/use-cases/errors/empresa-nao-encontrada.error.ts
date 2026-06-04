export class EmpresaNaoEncontradaError extends Error {
  constructor(id: number) {
    super(`Empresa #${id} não encontrada`);
    this.name = 'EmpresaNaoEncontradaError';
  }
}
