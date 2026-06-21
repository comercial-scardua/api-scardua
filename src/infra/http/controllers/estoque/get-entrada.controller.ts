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
import { GetEntradaUseCase } from '../../../../domain/estoque/application/use-cases/get-entrada'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class GetEntradaController {
  constructor(private getEntrada: GetEntradaUseCase) {}

  @Get('entradas/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Buscar entrada por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getEntrada.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.entrada
  }
}
