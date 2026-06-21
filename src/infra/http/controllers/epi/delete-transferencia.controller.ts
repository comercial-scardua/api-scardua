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
import { ExcluirTransferenciaEpiUseCase } from '../../../../domain/epi/application/use-cases/excluir-transferencia-epi'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class DeleteTransferenciaController {
  constructor(private excluirTransferencia: ExcluirTransferenciaEpiUseCase) {}

  @Delete('transferencias/:id')
  @HttpCode(204)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Cancelar transferência' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirTransferencia.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
  }
}
