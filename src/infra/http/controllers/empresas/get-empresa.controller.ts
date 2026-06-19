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
import { GetEmpresaUseCase } from '../../../../domain/empresas/application/use-cases/get-empresa'

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('/empresas')
@UseGuards(PermissionsGuard)
export class GetEmpresaController {
  constructor(private getEmpresa: GetEmpresaUseCase) {}

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('empresas', 'access')
  @ApiOperation({ summary: 'Buscar empresa por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getEmpresa.execute({ empresaId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { empresa: result.value.empresa }
  }
}
