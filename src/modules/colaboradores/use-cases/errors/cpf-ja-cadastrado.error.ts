export class CpfJaCadastradoError extends Error {
  constructor(cpf: string) {
    super(`CPF ${cpf} já está cadastrado`);
    this.name = 'CpfJaCadastradoError';
  }
}
