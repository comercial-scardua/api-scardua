export class EpiComVinculosError extends Error {
  constructor(id: number) {
    super(`EPI ${id} possui vínculos e não pode ser excluído`)
  }
}
