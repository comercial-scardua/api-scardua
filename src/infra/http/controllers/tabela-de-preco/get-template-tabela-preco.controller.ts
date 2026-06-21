import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetTemplateTabelaPrecoUseCase } from '../../../../domain/tabela-de-preco/application/use-cases/get-template-tabela-preco'

@ApiTags('Tabela de Preço')
@ApiBearerAuth()
@Controller('/tabela-de-preco')
@UseGuards(PermissionsGuard)
export class GetTemplateTabelaPrecoController {
  constructor(private getTemplate: GetTemplateTabelaPrecoUseCase) {}

  @Get('template')
  @HttpCode(200)
  @RequirePermission('tabela-de-preco', 'access')
  @ApiOperation({
    summary: 'Retorna template de importação de tabela de preços',
  })
  async handle() {
    const result = await this.getTemplate.execute()
    return result.value
  }
}
