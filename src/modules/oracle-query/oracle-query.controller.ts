import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { OracleBridgeService } from '../../common/oracle-bridge/oracle-bridge.service';

@ApiTags('Oracle Query')
@ApiBearerAuth()
@Controller('oracle-query')
@UseGuards(PermissionsGuard)
export class OracleQueryController {
  constructor(private readonly oracleBridge: OracleBridgeService) {}

  @Post('connect')
  @HttpCode(200)
  @RequirePermission('oracle-query', 'access')
  @ApiOperation({ summary: 'Conectar ao Oracle via Bridge' })
  async connect(@Body() body: Record<string, unknown>) {
    try {
      const result = await this.oracleBridge.query('SELECT 1 FROM DUAL', []);
      if (result.success) {
        return { status: 'connected', message: 'Conexão com Oracle estabelecida', body };
      }
      return { status: 'error', message: result.message || 'Falha na conexão' };
    } catch {
      return { status: 'error', message: 'Não foi possível conectar ao Oracle' };
    }
  }

  @Post('disconnect')
  @HttpCode(200)
  @RequirePermission('oracle-query', 'access')
  @ApiOperation({ summary: 'Desconectar do Oracle' })
  async disconnect() {
    return { status: 'disconnected', message: 'Sessão Oracle encerrada' };
  }

  @Post('execute')
  @HttpCode(200)
  @RequirePermission('oracle-query', 'edit')
  @ApiOperation({ summary: 'Executar query SQL no Oracle' })
  async execute(@Body() body: { sql: string; params?: unknown[] }) {
    if (!body.sql) {
      return { success: false, message: 'Campo sql é obrigatório', results: [] };
    }
    const result = await this.oracleBridge.query(body.sql, body.params ?? []);
    return result;
  }

  @Post('describe')
  @HttpCode(200)
  @RequirePermission('oracle-query', 'access')
  @ApiOperation({ summary: 'Descrever estrutura de uma tabela Oracle' })
  async describe(@Body() body: { tableName: string }) {
    if (!body.tableName) {
      return { success: false, message: 'Campo tableName é obrigatório', results: [] };
    }
    const sql = `SELECT column_name, data_type, data_length, nullable FROM all_tab_columns WHERE table_name = :1 ORDER BY column_id`;
    const result = await this.oracleBridge.query(sql, [body.tableName.toUpperCase()]);
    return result;
  }

  @Post('tables')
  @HttpCode(200)
  @RequirePermission('oracle-query', 'access')
  @ApiOperation({ summary: 'Listar tabelas disponíveis no Oracle' })
  async tables() {
    const sql = `SELECT table_name, num_rows FROM user_tables ORDER BY table_name`;
    const result = await this.oracleBridge.query(sql, []);
    return result;
  }

  @Post('update')
  @HttpCode(200)
  @RequirePermission('oracle-query', 'edit')
  @ApiOperation({ summary: 'Executar UPDATE/INSERT/DELETE no Oracle' })
  async update(@Body() body: { sql: string; params?: unknown[] }) {
    if (!body.sql) {
      return { success: false, message: 'Campo sql é obrigatório', results: [] };
    }
    const result = await this.oracleBridge.query(body.sql, body.params ?? []);
    return result;
  }
}
