import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GerarTermosRegistrosUseCase } from '../../../../domain/banco-horas/application/use-cases/gerar-termos-registros.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class GerarTermosRegistrosController {
  constructor(
    private gerarTermosRegistrosUseCase: GerarTermosRegistrosUseCase,
  ) {}

  @Post('gerar-termos-registros')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termos para múltiplos registros' })
  async handle(@Body() body: { registroIds: number[] }) {
    return this.gerarTermosRegistrosUseCase.execute(body.registroIds)
  }
}
