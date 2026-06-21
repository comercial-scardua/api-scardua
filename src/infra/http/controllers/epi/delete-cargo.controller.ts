import {
  ConflictException,
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
import { CargoComEpisError } from '../../../../domain/epi/application/use-cases/errors/cargo-com-epis.error'
import { ExcluirCargoEpiUseCase } from '../../../../domain/epi/application/use-cases/excluir-cargo-epi'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class DeleteCargoController {
  constructor(private excluirCargo: ExcluirCargoEpiUseCase) {}

  @Delete('cargos/:id')
  @HttpCode(204)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Remover cargo EPI' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirCargo.execute(id)
    if (result.isLeft()) {
      if (result.value instanceof CargoComEpisError)
        throw new ConflictException(result.value.message)
      throw new NotFoundException(result.value.message)
    }
  }
}
