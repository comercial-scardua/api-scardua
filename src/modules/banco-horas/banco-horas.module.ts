import { Module } from '@nestjs/common';
import { BancoHorasController } from './banco-horas.controller';
import { BancoHorasRepository } from './repositories/banco-horas.repository';
import { PrismaBancoHorasRepository } from './repositories/prisma-banco-horas.repository';
import { RegistrarPontoUseCase } from './use-cases/registrar-ponto.use-case';
import { ListarRegistrosUseCase } from './use-cases/listar-registros.use-case';
import { BuscarRegistroUseCase } from './use-cases/buscar-registro.use-case';
import { AtualizarRegistroUseCase } from './use-cases/atualizar-registro.use-case';
import { DeletarRegistroUseCase } from './use-cases/deletar-registro.use-case';
import { ObterSaldoHorasUseCase } from './use-cases/obter-saldo-horas.use-case';
import { ListarSaldosUseCase } from './use-cases/listar-saldos.use-case';

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
  ],
})
export class BancoHorasModule {}
