import {
  Controller,
  Get,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarProcessosUseCase } from '../../../../domain/sgq/application/use-cases/listar-processos'

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class ListarProcessosController {
  constructor(private listarProcessos: ListarProcessosUseCase) {}

  @Get('processes')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Listar processos SGQ' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  async handle(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.listarProcessos.execute({ filters: { status, search } })
  }
}
