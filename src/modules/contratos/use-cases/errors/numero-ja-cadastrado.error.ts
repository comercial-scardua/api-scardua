export class NumeroJaCadastradoError extends Error {
  constructor(numero: string) {
    super(`Já existe um contrato com o número "${numero}"`);
    this.name = 'NumeroJaCadastradoError';
  }
}
