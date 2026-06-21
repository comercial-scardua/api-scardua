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
import { ListarNaoConformidadesUseCase } from '../../../../domain/sgq/application/use-cases/listar-nao-conformidades'

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class ListarNaoConformidadesController {
  constructor(
    private listarNaoConformidades: ListarNaoConformidadesUseCase,
  ) {}

  @Get('non-conformities')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Listar nao-conformidades SGQ' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'origin', required: false })
  @ApiQuery({ name: 'processId', required: false, type: Number })
  async handle(
    @Query('status') status?: string,
    @Query('origin') origin?: string,
    @Query('processId', new ParseIntPipe({ optional: true }))
    processId?: number,
  ) {
    return this.listarNaoConformidades.execute({
      filters: { status, origin, processId },
    })
  }
}
