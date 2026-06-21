import {
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
import { DeletarRegistroUseCase } from '../../../../domain/banco-horas/application/use-cases/deletar-registro.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class DeletarRegistroController {
  constructor(private deletarRegistroUseCase: DeletarRegistroUseCase) {}

  @Delete('registros/:id')
  @HttpCode(204)
  @RequirePermission('banco-horas', 'edit')
  @ApiOperation({ summary: 'Deletar registro de ponto' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deletarRegistroUseCase.execute(id)

    if (result.isLeft()) {
      throw new NotFoundException((result.value as Error).message)
    }
  }
}
