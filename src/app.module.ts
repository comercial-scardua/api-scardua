import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { OracleBridgeModule } from './common/oracle-bridge/oracle-bridge.module'
import { SupabaseModule } from './common/supabase/supabase.module'
import { EnvModule } from './env/env.module'
import { envSchema } from './env/env.schema'
import { AniversariantesModule } from './infra/aniversariantes.module'
import { BancoHorasModule } from './infra/banco-horas.module'
import { CaixaViagemModule } from './infra/caixa-viagem.module'
import { CheckCpfModule } from './infra/check-cpf.module'
import { ColaboradoresModule } from './infra/colaboradores.module'
import { ContaCorrenteModule } from './infra/conta-corrente.module'
import { ContratosModule } from './infra/contratos.module'
import { DownloadModule } from './infra/download.module'
import { EmpresasModule } from './infra/empresas.module'
import { EpiModule } from './infra/epi.module'
import { ErrosModule } from './infra/erros.module'
import { EstoqueModule } from './infra/estoque.module'
import { EventosModule } from './infra/eventos.module'
import { GestorEmpresasModule } from './infra/gestor-empresas.module'
import { HealthModule } from './infra/health.module'
import { ImgProxyModule } from './infra/img-proxy.module'
import { ImportacaoPrecosModule } from './infra/importacao-precos.module'
import { LancamentoModule } from './infra/lancamento.module'
import { LancamentoViagemModule } from './infra/lancamento-viagem.module'
import { MonitorRegistrosModule } from './infra/monitor-registros.module'
import { MovimentacaoModule } from './infra/movimentacao.module'
import { NcmModule } from './infra/ncm.module'
import { NcmCheckModule } from './infra/ncm-check.module'
import { NcmUtilitiesModule } from './infra/ncm-utilities.module'
import { OracleCredentialsModule } from './infra/oracle-credentials.module'
import { OracleTestModule } from './infra/oracle-test.module'
import { PatrimoniosModule } from './infra/patrimonios.module'
import { PermissoesModule } from './infra/permissoes.module'
import { PrecificadorModule } from './infra/precificador.module'
import { PrecoVendaModule } from './infra/preco-venda.module'
import { ProtectedModule } from './infra/protected.module'
import { RelatoriosModule } from './infra/relatorios.module'
import { ReportsModule } from './infra/reports.module'
import { SgqModule } from './infra/sgq.module'
import { StatusModule } from './infra/status.module'
import { SuporteModule } from './infra/suporte.module'
import { TabelaDePrecoModule } from './infra/tabela-de-preco.module'
import { UniformeModule } from './infra/uniforme.module'
import { UploadImageModule } from './infra/upload-image.module'
import { UsuariosModule } from './infra/usuarios.module'
import { ManuaisModule } from './infra/manuais.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const result = envSchema.safeParse(config)
        if (!result.success) {
          console.error(
            '❌ Variáveis de ambiente inválidas:',
            result.error.format(),
          )
          throw new Error('Variáveis de ambiente inválidas')
        }
        return result.data
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
    UniformeModule,
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
    OracleCredentialsModule,
    OracleTestModule,
    // Utility modules
    CheckCpfModule,
    DownloadModule,
    HealthModule,
    ImgProxyModule,
    ProtectedModule,
    StatusModule,
    UploadImageModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
