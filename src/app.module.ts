import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { envSchema } from './env/env.schema';
import { EnvModule } from './env/env.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { OracleBridgeModule } from './common/oracle-bridge/oracle-bridge.module';
import { SupabaseModule } from './common/supabase/supabase.module';
import { AniversariantesModule } from './modules/aniversariantes/aniversariantes.module';
import { BancoHorasModule } from './modules/banco-horas/banco-horas.module';
import { CaixaViagemModule } from './modules/caixa-viagem/caixa-viagem.module';
import { CheckCpfModule } from './modules/check-cpf/check-cpf.module';
import { ColaboradoresModule } from './modules/colaboradores/colaboradores.module';
import { ContratosModule } from './modules/contratos/contratos.module';
import { DownloadModule } from './modules/download/download.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { ErrosModule } from './modules/erros/erros.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { ContaCorrenteModule } from './modules/conta-corrente/conta-corrente.module';
import { EpiModule } from './modules/epi/epi.module';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { GestorEmpresasModule } from './modules/gestor-empresas/gestor-empresas.module';
import { HealthModule } from './modules/health/health.module';
import { ImgProxyModule } from './modules/img-proxy/img-proxy.module';
import { ImportacaoPrecosModule } from './modules/importacao-precos/importacao-precos.module';
import { LancamentoModule } from './modules/lancamento/lancamento.module';
import { LancamentoViagemModule } from './modules/lancamento-viagem/lancamento-viagem.module';
import { ManuaisModule } from './modules/manuais/manuais.module';
import { MonitorRegistrosModule } from './modules/monitor-registros/monitor-registros.module';
import { MovimentacaoModule } from './modules/movimentacao/movimentacao.module';
import { NcmModule } from './modules/ncm/ncm.module';
import { NcmCheckModule } from './modules/ncm-check/ncm-check.module';
import { NcmUtilitiesModule } from './modules/ncm-utilities/ncm-utilities.module';
import { BridgeModule } from './modules/bridge/bridge.module';
import { OracleCredentialsModule } from './modules/oracle-credentials/oracle-credentials.module';
import { OracleQueryModule } from './modules/oracle-query/oracle-query.module';
import { OracleTestModule } from './modules/oracle-test/oracle-test.module';
import { PatrimoniosModule } from './modules/patrimonios/patrimonios.module';
import { PermissoesModule } from './modules/permissoes/permissoes.module';
import { PrecificadorModule } from './modules/precificador/precificador.module';
import { PrecoVendaModule } from './modules/preco-venda/preco-venda.module';
import { ProtectedModule } from './modules/protected/protected.module';
import { RelatoriosModule } from './modules/relatorios/relatorios.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SgqModule } from './modules/sgq/sgq.module';
import { StatusModule } from './modules/status/status.module';
import { SuporteModule } from './modules/suporte/suporte.module';
import { TabelaDePrecoModule } from './modules/tabela-de-preco/tabela-de-preco.module';
import { TestModulesModule } from './modules/test-modules/test-modules.module';
import { UploadImageModule } from './modules/upload-image/upload-image.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { DebugModule } from './modules/debug/debug.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          console.error('❌ Variáveis de ambiente inválidas:', result.error.format());
          throw new Error('Variáveis de ambiente inválidas');
        }
        return result.data;
      },
    }),
    EnvModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    SupabaseModule,
    OracleBridgeModule,
    AuthModule,
    // Core modules
    AniversariantesModule,
    BancoHorasModule,
    CaixaViagemModule,
    ColaboradoresModule,
    ContaCorrenteModule,
    ContratosModule,
    EmpresasModule,
    EpiModule,
    ErrosModule,
    EstoqueModule,
    EventosModule,
    GestorEmpresasModule,
    ManuaisModule,
    MovimentacaoModule,
    NcmModule,
    PatrimoniosModule,
    PermissoesModule,
    RelatoriosModule,
    SgqModule,
    SuporteModule,
    UsuariosModule,
    // Pricing modules
    ImportacaoPrecosModule,
    LancamentoModule,
    LancamentoViagemModule,
    MonitorRegistrosModule,
    NcmCheckModule,
    NcmUtilitiesModule,
    PrecificadorModule,
    PrecoVendaModule,
    ReportsModule,
    TabelaDePrecoModule,
    // Oracle / Bridge modules
    BridgeModule,
    OracleCredentialsModule,
    OracleQueryModule,
    OracleTestModule,
    // Utility modules
    CheckCpfModule,
    DebugModule,
    DownloadModule,
    HealthModule,
    ImgProxyModule,
    ProtectedModule,
    StatusModule,
    TestModulesModule,
    UploadImageModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
