import type {
  conta_corrente_horas,
  registros_banco_horas,
} from '@prisma/client'
import type { RegistrarPontoDto } from '../dto/registrar-ponto.dto'

export abstract class BancoHorasRepository {
  abstract listarRegistros(
    colaboradorId: number,
    dataInicio?: Date,
    dataFim?: Date,
  ): Promise<registros_banco_horas[]>
  abstract buscarRegistro(id: number): Promise<registros_banco_horas | null>
  abstract criarRegistro(
    data: RegistrarPontoDto,
  ): Promise<registros_banco_horas>
  abstract atualizarRegistro(
    id: number,
    data: Partial<RegistrarPontoDto>,
  ): Promise<registros_banco_horas>
  abstract deletarRegistro(id: number): Promise<registros_banco_horas>
  abstract obterSaldoHoras(
    colaboradorId: number,
  ): Promise<conta_corrente_horas | null>
  abstract listarSaldosPorColaborador(): Promise<conta_corrente_horas[]>
}
