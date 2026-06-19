export class NcmDuplicadoError extends Error {
  constructor() {
    super(
      'Já existe um NCM com essa combinação (Código + Categoria + Empresa + UF Emissor + UF Destino + CST Origem)',
    )
    this.name = 'NcmDuplicadoError'
  }
}
