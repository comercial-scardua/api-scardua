import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CreateRelatorioUseCase } from '../../../../domain/relatorios/application/use-cases/create-relatorio'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createRelatorioBodySchema = z.object({
  nome: z.string().min(1),
  departamento: z.string().min(1),
  descricao: z.string().nullish(),
  query_sql: z.string().min(1),
  restrito: z.boolean().default(false),
  usuario_id: z.number().int().positive().nullish(),
  usuario_nome: z.string().nullish(),
  banco_dados: z.string().default('oracle'),
  parametros: z.string().nullish(),
  ativo: z.boolean().default(true),
})

type CreateRelatorioBody = z.infer<typeof createRelatorioBodySchema>

@ApiTags('Relatorios')
@ApiBearerAuth()
@Controller('/relatorios')
@UseGuards(PermissionsGuard)
export class CreateRelatorioController {
  constructor(private createRelatorio: CreateRelatorioUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('relatorios', 'edit')
  @ApiOperation({ summary: 'Criar relatorio' })
  @UsePipes(new ZodValidationPipe(createRelatorioBodySchema))
  async handle(@Body() body: CreateRelatorioBody) {
    const result = await this.createRelatorio.execute(body)

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { relatorioId: result.value.relatorio.id }
  }
}
