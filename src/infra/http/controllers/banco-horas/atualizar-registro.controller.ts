import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { RegistrarPontoData } from '../../../../domain/banco-horas/application/repositories/banco-horas-repository'
import { AtualizarRegistroUseCase } from '../../../../domain/banco-horas/application/use-cases/atualizar-registro.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class AtualizarRegistroController {
  constructor(private atualizarRegistroUseCase: AtualizarRegistroUseCase) {}

  @Patch('registros/:id')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'edit')
  @ApiOperation({ summary: 'Atualizar registro de ponto' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<RegistrarPontoData>,
  ) {
    const result = await this.atualizarRegistroUseCase.execute(id, dto)

    if (result.isLeft()) {
      throw new NotFoundException((result.value as Error).message)
    }

    return (result.value as any).registro
  }
}
