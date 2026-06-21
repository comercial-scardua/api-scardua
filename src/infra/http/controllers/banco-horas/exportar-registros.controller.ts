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
import { ExportarRegistrosUseCase } from '../../../../domain/banco-horas/application/use-cases/exportar-registros.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class ExportarRegistrosController {
  constructor(private exportarRegistrosUseCase: ExportarRegistrosUseCase) {}

  @Get('exportar')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({
    summary: 'Exportar todos os registros de banco de horas em JSON',
  })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  @ApiQuery({ name: 'dataInicio', required: false, type: String })
  @ApiQuery({ name: 'dataFim', required: false, type: String })
  async handle(
    @Query('colaboradorId', new ParseIntPipe({ optional: true }))
    colaboradorId?: number,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.exportarRegistrosUseCase.execute(
      colaboradorId,
      dataInicio,
      dataFim,
    )
  }
}
