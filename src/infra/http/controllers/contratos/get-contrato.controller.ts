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
import { GetContratoUseCase } from '../../../../domain/contratos/application/use-cases/get-contrato'

@ApiTags('Contratos')
@ApiBearerAuth()
@Controller('/contratos')
@UseGuards(PermissionsGuard)
export class GetContratoController {
  constructor(private getContrato: GetContratoUseCase) {}

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('contratos', 'access')
  @ApiOperation({ summary: 'Buscar contrato por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getContrato.execute({ contratoId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { contrato: result.value.contrato }
  }
}
