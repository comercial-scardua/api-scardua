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
import { UpdateSaidaUseCase } from '../../../../domain/estoque/application/use-cases/update-saida'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class UpdateSaidaController {
  constructor(private updateSaida: UpdateSaidaUseCase) {}

  @Post('saidas/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Atualizar saída por ID (campos parciais)' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, unknown>,
  ) {
    const result = await this.updateSaida.execute(id, body)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.saida
  }
}
