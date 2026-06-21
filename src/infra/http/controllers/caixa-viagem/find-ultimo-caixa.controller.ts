import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FindUltimoCaixaFuncionarioUseCase } from '../../../../domain/caixa-viagem/application/use-cases/find-ultimo-caixa-funcionario'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class FindUltimoCaixaController {
  constructor(
    private findUltimoCaixaFuncionario: FindUltimoCaixaFuncionarioUseCase,
  ) {}

  @Get('ultimo-caixa/:funcionarioId')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Buscar último caixa de um funcionário' })
  async handle(@Param('funcionarioId', ParseIntPipe) funcionarioId: number) {
    const result = await this.findUltimoCaixaFuncionario.execute({
      funcionarioId,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.caixa
  }
}
