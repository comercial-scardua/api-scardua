import {
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ObterContaCorrenteUseCase } from '../../../../domain/banco-horas/application/use-cases/obter-conta-corrente.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class ObterContaCorrenteController {
  constructor(private obterContaCorrenteUseCase: ObterContaCorrenteUseCase) {}

  @Get('conta-corrente')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Obter conta corrente de horas' })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  async handle(
    @Query('colaboradorId', new ParseIntPipe({ optional: true }))
    colaboradorId?: number,
  ) {
    if (colaboradorId) {
      return this.obterContaCorrenteUseCase.executePorColaborador(colaboradorId)
    }
    return this.obterContaCorrenteUseCase.executeTodas()
  }
}
