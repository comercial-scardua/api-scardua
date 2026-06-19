import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetRelatorioUseCase } from '../../../../domain/relatorios/application/use-cases/get-relatorio'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const executeRelatorioBodySchema = z.object({
  id: z.number().int().positive(),
  parametros: z.record(z.string(), z.unknown()).optional(),
})

type ExecuteRelatorioBody = z.infer<typeof executeRelatorioBodySchema>

@ApiTags('Relatorios')
@ApiBearerAuth()
@Controller('/relatorios')
@UseGuards(PermissionsGuard)
export class ExecuteRelatorioController {
  constructor(private getRelatorio: GetRelatorioUseCase) {}

  @Post('execute')
  @HttpCode(200)
  @RequirePermission('relatorios', 'access')
  @ApiOperation({
    summary: 'Executar query SQL do relatorio (via Oracle bridge)',
  })
  @UsePipes(new ZodValidationPipe(executeRelatorioBodySchema))
  async handle(@Body() body: ExecuteRelatorioBody) {
    const result = await this.getRelatorio.execute({ relatorioId: body.id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return {
      sql: result.value.relatorio.query_sql,
      parametros: body.parametros,
      message: 'Execute via Oracle bridge',
    }
  }
}
