export class CnpjJaCadastradoError extends Error {
  constructor(cnpj: string) {
    super(`CNPJ "${cnpj}" já está cadastrado`);
    this.name = 'CnpjJaCadastradoError';
  }
}
