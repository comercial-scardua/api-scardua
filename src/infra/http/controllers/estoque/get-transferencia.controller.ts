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
import { GetTransferenciaUseCase } from '../../../../domain/estoque/application/use-cases/get-transferencia'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class GetTransferenciaController {
  constructor(private getTransferencia: GetTransferenciaUseCase) {}

  @Get('transferencias/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Buscar transferência por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getTransferencia.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.transferencia
  }
}
