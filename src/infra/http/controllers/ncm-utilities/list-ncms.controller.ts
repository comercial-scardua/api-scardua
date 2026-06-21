import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListNcmsUseCase } from '../../../../domain/ncm-utilities/application/use-cases/list-ncms'

@ApiTags('NCM Utilities')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class ListNcmsController {
  constructor(private listNcms: ListNcmsUseCase) {}

  @Get('list-ncms')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'access')
  @ApiOperation({ summary: 'Listar todos os NCMs paginado' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Pagina (padrao: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Itens por pagina (padrao: 100)',
  })
  async handle(@Query('page') page?: string, @Query('limit') limit?: string) {
    const result = await this.listNcms.execute({
      page: page ? Number.parseInt(page, 10) : undefined,
      limit: limit ? Number.parseInt(limit, 10) : undefined,
    })
    return result.value
  }
}
