import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { UpdateTransferenciaUseCase } from '../../../../domain/estoque/application/use-cases/update-transferencia'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class UpdateTransferenciaController {
  constructor(private updateTransferencia: UpdateTransferenciaUseCase) {}

  @Post('transferencias/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Atualizar transferência por ID (campos parciais)' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, unknown>,
  ) {
    const result = await this.updateTransferencia.execute(id, body)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.transferencia
  }
}
