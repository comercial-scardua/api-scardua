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
import { EpiComVinculosError } from '../../../../domain/epi/application/use-cases/errors/epi-com-vinculos.error'
import { ExcluirEpiUseCase } from '../../../../domain/epi/application/use-cases/excluir-epi'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class DeleteEpiController {
  constructor(private excluirEpi: ExcluirEpiUseCase) {}

  @Delete('epis/:id')
  @HttpCode(204)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Deletar EPI' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirEpi.execute(id)
    if (result.isLeft()) {
      if (result.value instanceof EpiComVinculosError)
        throw new ConflictException(result.value.message)
      throw new NotFoundException(result.value.message)
    }
  }
}
