import type {
  conta_corrente_horas,
  registros_banco_horas,
} from '@prisma/client'

export interface RegistrarPontoData {
  colaboradorId: number
  tipo: string
  data: Date
  horaInicio?: string
  horaFim?: string
  intervaloMinutos?: number
  horasCorrigidas?: number
  acao?: string
  observacao?: string
}

export abstract class BancoHorasRepository {
  abstract listarRegistros(
    colaboradorId: number,
    dataInicio?: Date,
    dataFim?: Date,
  ): Promise<registros_banco_horas[]>
  abstract buscarRegistro(id: number): Promise<registros_banco_horas | null>
  abstract criarRegistro(
    data: RegistrarPontoData,
  ): Promise<registros_banco_horas>
  abstract atualizarRegistro(
    id: number,
    data: Partial<RegistrarPontoData>,
  ): Promise<registros_banco_horas>
  abstract deletarRegistro(id: number): Promise<registros_banco_horas>
  abstract obterSaldoHoras(
    colaboradorId: number,
  ): Promise<conta_corrente_horas | null>
  abstract listarSaldosPorColaborador(): Promise<conta_corrente_horas[]>
}
