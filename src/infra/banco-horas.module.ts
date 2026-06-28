import { Module } from '@nestjs/common'
import { BancoHorasRepository } from '../domain/banco-horas/application/repositories/banco-horas-repository'
import { AtualizarRegistroUseCase } from '../domain/banco-horas/application/use-cases/atualizar-registro.use-case'
import { BuscarRegistroUseCase } from '../domain/banco-horas/application/use-cases/buscar-registro.use-case'
import { DebugBancoHorasUseCase } from '../domain/banco-horas/application/use-cases/debug-banco-horas.use-case'
import { DeletarRegistroUseCase } from '../domain/banco-horas/application/use-cases/deletar-registro.use-case'
import { ExportarRegistrosUseCase } from '../domain/banco-horas/application/use-cases/exportar-registros.use-case'
import { GerarRelatorioUseCase } from '../domain/banco-horas/application/use-cases/gerar-relatorio.use-case'
import { GerarTermoAusenciaUseCase } from '../domain/banco-horas/application/use-cases/gerar-termo-ausencia.use-case'
import { GerarTermoBancoHorasUseCase } from '../domain/banco-horas/application/use-cases/gerar-termo-banco-horas.use-case'
import { GerarTermoPdfUseCase } from '../domain/banco-horas/application/use-cases/gerar-termo-pdf.use-case'
import { GerarTermosRegistrosUseCase } from '../domain/banco-horas/application/use-cases/gerar-termos-registros.use-case'
import { ListarFuncionariosBancoHorasUseCase } from '../domain/banco-horas/application/use-cases/listar-funcionarios-banco-horas.use-case'
import { ListarRegistrosUseCase } from '../domain/banco-horas/application/use-cases/listar-registros.use-case'
import { ObterContaCorrenteUseCase } from '../domain/banco-horas/application/use-cases/obter-conta-corrente.use-case'
import { ObterEstatisticasUseCase } from '../domain/banco-horas/application/use-cases/obter-estatisticas.use-case'
import { ObterHorasUsuarioUseCase } from '../domain/banco-horas/application/use-cases/obter-horas-usuario.use-case'
import { RegistrarPontoUseCase } from '../domain/banco-horas/application/use-cases/registrar-ponto.use-case'
import { SincronizarContasUseCase } from '../domain/banco-horas/application/use-cases/sincronizar-contas.use-case'
import { StatusSincronizacaoUseCase } from '../domain/banco-horas/application/use-cases/status-sincronizacao.use-case'
import { PrismaBancoHorasRepository } from './database/prisma/repositories/prisma-banco-horas-repository'
import { AtualizarRegistroController } from './http/controllers/banco-horas/atualizar-registro.controller'
import { BaixarTermoController } from './http/controllers/banco-horas/baixar-termo.controller'
import { BuscarRegistroController } from './http/controllers/banco-horas/buscar-registro.controller'
import { DebugBancoHorasController } from './http/controllers/banco-horas/debug-banco-horas.controller'
import { DeletarRegistroController } from './http/controllers/banco-horas/deletar-registro.controller'
import { ExportarRegistrosController } from './http/controllers/banco-horas/exportar-registros.controller'
import { ExportarRelatorioController } from './http/controllers/banco-horas/exportar-relatorio.controller'
import { GerarRelatorioController } from './http/controllers/banco-horas/gerar-relatorio.controller'
import { GerarTermoController } from './http/controllers/banco-horas/gerar-termo.controller'
import { GerarTermoAusenciaController } from './http/controllers/banco-horas/gerar-termo-ausencia.controller'
import { GerarTermoAusenciaPdfController } from './http/controllers/banco-horas/gerar-termo-ausencia-pdf.controller'
import { GerarTermoPdfPostController } from './http/controllers/banco-horas/gerar-termo-pdf-post.controller'
import { GerarTermosRegistrosController } from './http/controllers/banco-horas/gerar-termos-registros.controller'
import { ListarFuncionariosController } from './http/controllers/banco-horas/listar-funcionarios.controller'
import { ListarRegistrosController } from './http/controllers/banco-horas/listar-registros.controller'
import { ObterContaCorrenteController } from './http/controllers/banco-horas/obter-conta-corrente.controller'
import { ObterEstatisticasController } from './http/controllers/banco-horas/obter-estatisticas.controller'
import { ObterHorasUsuarioController } from './http/controllers/banco-horas/obter-horas-usuario.controller'
import { RegistrarPontoController } from './http/controllers/banco-horas/registrar-ponto.controller'
import { SincronizarContasController } from './http/controllers/banco-horas/sincronizar-contas.controller'
import { StatusSincronizacaoController } from './http/controllers/banco-horas/status-sincronizacao.controller'

@Module({
  controllers: [
    // Static routes FIRST
    RegistrarPontoController,
    ListarRegistrosController,
    ObterEstatisticasController,
    GerarRelatorioController,
    ObterContaCorrenteController,
    ListarFuncionariosController,
    ObterHorasUsuarioController,
    GerarTermoController,
    GerarTermoPdfPostController,
    GerarTermoAusenciaController,
    GerarTermoAusenciaPdfController,
    GerarTermosRegistrosController,
    BaixarTermoController,
    StatusSincronizacaoController,
    SincronizarContasController,
    ExportarRegistrosController,
    ExportarRelatorioController,
    DebugBancoHorasController,
    // Parametric routes AFTER
    BuscarRegistroController,
    AtualizarRegistroController,
    DeletarRegistroController,
  ],
  providers: [
    { provide: BancoHorasRepository, useClass: PrismaBancoHorasRepository },
    RegistrarPontoUseCase,
    ListarRegistrosUseCase,
    BuscarRegistroUseCase,
    AtualizarRegistroUseCase,
    DeletarRegistroUseCase,
    ObterEstatisticasUseCase,
    GerarRelatorioUseCase,
    GerarTermoPdfUseCase,
    ObterContaCorrenteUseCase,
    ListarFuncionariosBancoHorasUseCase,
    ObterHorasUsuarioUseCase,
    GerarTermoBancoHorasUseCase,
    GerarTermoAusenciaUseCase,
    GerarTermosRegistrosUseCase,
    StatusSincronizacaoUseCase,
    SincronizarContasUseCase,
    ExportarRegistrosUseCase,
    DebugBancoHorasUseCase,
  ],
})
export class BancoHorasModule {}
