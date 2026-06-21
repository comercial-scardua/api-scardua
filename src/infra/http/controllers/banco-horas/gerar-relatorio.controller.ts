import {
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GerarRelatorioUseCase } from '../../../../domain/banco-horas/application/use-cases/gerar-relatorio.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class GerarRelatorioController {
  constructor(private gerarRelatorioUseCase: GerarRelatorioUseCase) {}

  @Get('relatorios')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar relatório de horas em JSON' })
  @ApiQuery({ name: 'dataInicio', required: false, type: String })
  @ApiQuery({ name: 'dataFim', required: false, type: String })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  async handle(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('colaboradorId', new ParseIntPipe({ optional: true }))
    colaboradorId?: number,
  ): Promise<any> {
    return this.gerarRelatorioUseCase.execute(
      dataInicio ? new Date(dataInicio) : undefined,
      dataFim ? new Date(dataFim) : undefined,
      colaboradorId,
    )
  }
}
