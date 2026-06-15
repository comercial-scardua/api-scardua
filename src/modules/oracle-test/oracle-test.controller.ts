import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { OracleBridgeService } from '../../common/oracle-bridge/oracle-bridge.service';

@ApiTags('Oracle Test')
@ApiBearerAuth()
@Controller('oracle-test')
@UseGuards(PermissionsGuard)
export class OracleTestController {
  constructor(private readonly oracleBridge: OracleBridgeService) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('oracle-test', 'access')
  @ApiOperation({ summary: 'Testar conexão com o Oracle' })
  async testConnection() {
    try {
      const result = await this.oracleBridge.query('SELECT 1 FROM DUAL', []);
      if (result.success) {
        return {
          status: 'connected',
          message: 'Conexão Oracle funcionando corretamente',
          results: result.results,
        };
      }
      return {
        status: 'error',
        message: result.message || 'Falha na conexão Oracle',
      };
    } catch {
      return {
        status: 'not_configured',
        message: 'Oracle Bridge não disponível',
      };
    }
  }

  @Post()
  @HttpCode(200)
  @RequirePermission('oracle-test', 'edit')
  @ApiOperation({ summary: 'Executar teste de query simples no Oracle' })
  async testQuery(@Body() body: { sql?: string; params?: unknown[] }) {
    const sql = body.sql || 'SELECT SYSDATE AS data_atual FROM DUAL';
    try {
      const result = await this.oracleBridge.query(sql, body.params ?? []);
      return {
        sql,
        ...result,
      };
    } catch {
      return {
        status: 'not_configured',
        message: 'Oracle Bridge não disponível',
        sql,
      };
    }
  }
}
