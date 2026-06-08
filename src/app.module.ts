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
import { ColaboradoresModule } from './modules/colaboradores/colaboradores.module';
import { ContratosModule } from './modules/contratos/contratos.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { ContaCorrenteModule } from './modules/conta-corrente/conta-corrente.module';
import { EpiModule } from './modules/epi/epi.module';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { ManuaisModule } from './modules/manuais/manuais.module';
import { NcmModule } from './modules/ncm/ncm.module';
import { PatrimoniosModule } from './modules/patrimonios/patrimonios.module';
import { PermissoesModule } from './modules/permissoes/permissoes.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
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
    ColaboradoresModule,
    UsuariosModule,
    EmpresasModule,
    PermissoesModule,
    NcmModule,
    ContratosModule,
    ManuaisModule,
    PatrimoniosModule,
    ContaCorrenteModule,
    EstoqueModule,
    EpiModule,
    // Próximos módulos a migrar:
    // BancoHorasModule,
    // CaixaViagemModule,
    // PrecificadorModule,
    // EpiModule,
    // EstoqueModule,
    // PatrimonioModule,
    // SuporteModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
