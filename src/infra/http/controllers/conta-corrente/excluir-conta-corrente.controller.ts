import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ExcluirContaCorrenteUseCase } from '../../../../domain/conta-corrente/application/use-cases/excluir-conta-corrente'

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class ExcluirContaCorrenteController {
  constructor(private excluirConta: ExcluirContaCorrenteUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Excluir conta e seus lançamentos (cascade)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirConta.execute({ id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
