export class EmailJaCadastradoError extends Error {
  constructor(email: string) {
    super(`E-mail "${email}" já está cadastrado`);
    this.name = 'EmailJaCadastradoError';
  }
}
