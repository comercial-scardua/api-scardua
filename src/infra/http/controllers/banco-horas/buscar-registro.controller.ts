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
import { BuscarRegistroUseCase } from '../../../../domain/banco-horas/application/use-cases/buscar-registro.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class BuscarRegistroController {
  constructor(private buscarRegistroUseCase: BuscarRegistroUseCase) {}

  @Get('registros/:id')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Buscar registro de ponto por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscarRegistroUseCase.execute(id)

    if (result.isLeft()) {
      throw new NotFoundException((result.value as Error).message)
    }

    return (result.value as any).registro
  }
}
