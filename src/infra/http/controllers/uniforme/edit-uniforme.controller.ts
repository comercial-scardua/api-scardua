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
import { EditUniformeUseCase } from '../../../../domain/uniforme/application/use-cases/edit-uniforme'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const editUniformeBodySchema = z.object({
  nome: z.string().optional().nullable(),
  codigo: z.string().optional().nullable(),
  categoria: z.string().optional().nullable(),
  tamanho: z.string().optional().nullable(),
  fabricante: z.string().optional().nullable(),
  vida_util_dias: z.coerce.number().optional().nullable(),
  estoque_minimo: z.coerce.number().optional().nullable(),
  status: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
})

type EditUniformeBody = z.infer<typeof editUniformeBodySchema>

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/uniformes')
@UseGuards(PermissionsGuard)
export class EditUniformeController {
  constructor(private editUniforme: EditUniformeUseCase) {}

  @Put(':id')
  @HttpCode(200)
  @RequirePermission('uniforme', 'edit')
  @ApiOperation({ summary: 'Atualizar uniforme' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(editUniformeBodySchema)) body: EditUniformeBody,
  ) {
    const result = await this.editUniforme.execute({ id, ...body })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value
  }
}
