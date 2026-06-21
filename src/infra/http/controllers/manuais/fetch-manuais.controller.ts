import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ManuaisRepository } from '../../../../domain/manuais/application/repositories/manuais-repository'

@ApiTags('Manuais')
@ApiBearerAuth()
@Controller('/manuais')
@UseGuards(PermissionsGuard)
export class FetchManuaisController {
  constructor(private manuaisRepository: ManuaisRepository) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('manuais', 'access')
  @ApiOperation({ summary: 'Listar manuais ativos (sem descricao)' })
  async handle() {
    return this.manuaisRepository.findAll()
  }
}
