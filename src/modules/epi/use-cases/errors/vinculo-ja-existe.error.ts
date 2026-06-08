export class VinculoJaExisteError extends Error {
  constructor() {
    super('Vínculo EPI × Cargo já existe')
  }
}
