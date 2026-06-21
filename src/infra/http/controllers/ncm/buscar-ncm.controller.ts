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
import { BuscarNcmUseCase } from '../../../../domain/ncm/application/use-cases/buscar-ncm'

@ApiTags('NCM')
@ApiBearerAuth()
@Controller('/ncm')
@UseGuards(PermissionsGuard)
export class BuscarNcmController {
  constructor(private buscarNcm: BuscarNcmUseCase) {}

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('ncm', 'access')
  @ApiOperation({ summary: 'Buscar NCM por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscarNcm.execute(id)

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.ncm
  }
}
