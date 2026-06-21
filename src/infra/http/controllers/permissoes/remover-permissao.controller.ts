import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { RemoverPermissaoUseCase } from '../../../../domain/permissoes/application/use-cases/remover-permissao'

@ApiTags('Permissões')
@ApiBearerAuth()
@Controller('/permissoes')
@UseGuards(PermissionsGuard)
export class RemoverPermissaoController {
  constructor(private removerPermissao: RemoverPermissaoUseCase) {}

  @Delete(':userId/:page')
  @HttpCode(204)
  @RequirePermission('permissoes', 'edit')
  @ApiOperation({ summary: 'Remover permissão de uma página específica' })
  async handle(
    @Param('userId') userId: string,
    @Param('page') page: string,
  ) {
    const result = await this.removerPermissao.execute(userId, page)

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
