import { Module } from '@nestjs/common'
import { BancoHorasController } from './banco-horas.controller'
import { BancoHorasRepository } from './repositories/banco-horas.repository'
import { PrismaBancoHorasRepository } from './repositories/prisma-banco-horas.repository'
import { RegistrarPontoUseCase } from './use-cases/registrar-ponto.use-case'
import { ListarRegistrosUseCase } from './use-cases/listar-registros.use-case'
import { BuscarRegistroUseCase } from './use-cases/buscar-registro.use-case'
import { AtualizarRegistroUseCase } from './use-cases/atualizar-registro.use-case'
import { DeletarRegistroUseCase } from './use-cases/deletar-registro.use-case'
import { ObterSaldoHorasUseCase } from './use-cases/obter-saldo-horas.use-case'
import { ListarSaldosUseCase } from './use-cases/listar-saldos.use-case'
import { ObterEstatisticasUseCase } from './use-cases/obter-estatisticas.use-case'
import { GerarRelatorioUseCase } from './use-cases/gerar-relatorio.use-case'
import { GerarTermoPdfUseCase } from './use-cases/gerar-termo-pdf.use-case'
import { ObterContaCorrenteUseCase } from './use-cases/obter-conta-corrente.use-case'

@Module({
  controllers: [BancoHorasController],
  providers: [
    {
      provide: BancoHorasRepository,
      useClass: PrismaBancoHorasRepository,
    },
    RegistrarPontoUseCase,
    ListarRegistrosUseCase,
    BuscarRegistroUseCase,
    AtualizarRegistroUseCase,
    DeletarRegistroUseCase,
    ObterSaldoHorasUseCase,
    ListarSaldosUseCase,
    ObterEstatisticasUseCase,
    GerarRelatorioUseCase,
    GerarTermoPdfUseCase,
    ObterContaCorrenteUseCase,
  ],
})
export class BancoHorasModule {}
