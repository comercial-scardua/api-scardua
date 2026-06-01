import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { OracleBridgeModule } from './common/oracle-bridge/oracle-bridge.module';
import { ColaboradoresModule } from './modules/colaboradores/colaboradores.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    OracleBridgeModule,
    AuthModule,
    ColaboradoresModule,
    // Próximos módulos a migrar:
    // EmpresasModule,
    // BancoHorasModule,
    // CaixaViagemModule,
    // PrecificadorModule,
    // NcmModule,
    // EpiModule,
    // ContratosModule,
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
