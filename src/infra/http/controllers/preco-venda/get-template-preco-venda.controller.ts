import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetTemplatePrecoVendaUseCase } from '../../../../domain/preco-venda/application/use-cases/get-template-preco-venda'

@ApiTags('Preco de Venda')
@ApiBearerAuth()
@Controller('/preco-venda')
@UseGuards(PermissionsGuard)
export class GetTemplatePrecoVendaController {
  constructor(private getTemplate: GetTemplatePrecoVendaUseCase) {}

  @Get('template')
  @HttpCode(200)
  @RequirePermission('preco-venda', 'access')
  @ApiOperation({
    summary: 'Retorna template JSON para importação de preços de venda',
  })
  async handle() {
    const result = await this.getTemplate.execute()
    return result.value.template
  }
}
