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
import { ListarHelpUseCase } from '../../../../domain/sgq/application/use-cases/listar-help'

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class ListarHelpController {
  constructor(private listarHelp: ListarHelpUseCase) {}

  @Get('help')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Listar artigos de ajuda SGQ' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'module', required: false })
  async handle(
    @Query('category') category?: string,
    @Query('module') module?: string,
  ) {
    return this.listarHelp.execute({ filters: { category, module } })
  }
}
