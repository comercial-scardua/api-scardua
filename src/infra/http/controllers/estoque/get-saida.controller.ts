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
import { GetSaidaUseCase } from '../../../../domain/estoque/application/use-cases/get-saida'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class GetSaidaController {
  constructor(private getSaida: GetSaidaUseCase) {}

  @Get('saidas/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Buscar saída por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getSaida.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.saida
  }
}
