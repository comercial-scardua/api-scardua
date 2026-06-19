import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EditRelatorioUseCase } from '../../../../domain/relatorios/application/use-cases/edit-relatorio'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const editRelatorioBodySchema = z.object({
  nome: z.string().min(1).optional(),
  departamento: z.string().min(1).optional(),
  descricao: z.string().nullish(),
  query_sql: z.string().min(1).optional(),
  restrito: z.boolean().optional(),
  usuario_id: z.number().int().positive().nullish(),
  usuario_nome: z.string().nullish(),
  banco_dados: z.string().optional(),
  parametros: z.string().nullish(),
  ativo: z.boolean().optional(),
})

type EditRelatorioBody = z.infer<typeof editRelatorioBodySchema>

@ApiTags('Relatorios')
@ApiBearerAuth()
@Controller('/relatorios')
@UseGuards(PermissionsGuard)
export class EditRelatorioController {
  constructor(private editRelatorio: EditRelatorioUseCase) {}

  @Post(':id')
  @HttpCode(204)
  @RequirePermission('relatorios', 'edit')
  @ApiOperation({ summary: 'Atualizar relatorio' })
  async handlePost(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(editRelatorioBodySchema))
    body: EditRelatorioBody,
  ) {
    await this.update(id, body)
  }

  @Patch(':id')
  @HttpCode(204)
  @RequirePermission('relatorios', 'edit')
  @ApiOperation({ summary: 'Atualizar relatorio (PATCH)' })
  async handlePatch(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(editRelatorioBodySchema))
    body: EditRelatorioBody,
  ) {
    await this.update(id, body)
  }

  private async update(id: number, data: EditRelatorioBody) {
    const result = await this.editRelatorio.execute({
      relatorioId: id,
      data,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
