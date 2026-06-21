import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { SearchNcmUseCase } from '../../../../domain/ncm-utilities/application/use-cases/search-ncm'

@ApiTags('NCM Utilities')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class SearchNcmController {
  constructor(private searchNcm: SearchNcmUseCase) {}

  @Get('search-ncm')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'access')
  @ApiOperation({ summary: 'Buscar NCM por codigo, descricao ou texto livre' })
  @ApiQuery({ name: 'q', required: false, description: 'Texto livre' })
  @ApiQuery({ name: 'codigo', required: false, description: 'Codigo NCM' })
  @ApiQuery({
    name: 'descricao',
    required: false,
    description: 'Categoria/descricao',
  })
  async handle(
    @Query('q') q?: string,
    @Query('codigo') codigo?: string,
    @Query('descricao') descricao?: string,
  ) {
    const result = await this.searchNcm.execute({ q, codigo, descricao })
    return result.value
  }
}
