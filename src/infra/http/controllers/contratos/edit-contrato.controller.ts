import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EditContratoUseCase } from '../../../../domain/contratos/application/use-cases/edit-contrato'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const editContratoBodySchema = z.object({
  titulo: z.string().min(1).optional(),
  fornecedor: z.string().min(1).optional(),
  valor: z.number().positive().optional(),
  data_inicio: z.string().optional(),
  data_vencimento: z.string().optional(),
  vencimento_indeterminado: z.boolean().optional(),
  departamento: z.string().min(1).optional(),
  responsavel: z.string().min(1).optional(),
  descricao: z.string().optional(),
  tipo_contrato: z.string().optional(),
  renovacao_automatica: z.boolean().optional(),
  alertas_ativos: z.boolean().optional(),
  observacao: z.string().optional(),
})

type EditContratoBody = z.infer<typeof editContratoBodySchema>

@ApiTags('Contratos')
@ApiBearerAuth()
@Controller('/contratos')
@UseGuards(PermissionsGuard)
export class EditContratoController {
  constructor(private editContrato: EditContratoUseCase) {}

  @Put(':id')
  @HttpCode(204)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({ summary: 'Atualizar contrato' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(editContratoBodySchema)) body: EditContratoBody,
  ) {
    const result = await this.editContrato.execute({
      contratoId: id,
      data: body,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
