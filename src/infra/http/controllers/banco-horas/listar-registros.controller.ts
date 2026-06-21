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
import { ListarRegistrosUseCase } from '../../../../domain/banco-horas/application/use-cases/listar-registros.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class ListarRegistrosController {
  constructor(private listarRegistrosUseCase: ListarRegistrosUseCase) {}

  @Get('registros')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Listar registros de ponto por colaborador' })
  @ApiQuery({ name: 'colaboradorId', required: true, type: Number })
  @ApiQuery({ name: 'dataInicio', required: false, type: String })
  @ApiQuery({ name: 'dataFim', required: false, type: String })
  async handle(
    @Query('colaboradorId', ParseIntPipe) colaboradorId: number,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.listarRegistrosUseCase.execute(
      colaboradorId,
      dataInicio ? new Date(dataInicio) : undefined,
      dataFim ? new Date(dataFim) : undefined,
    )
  }
}
