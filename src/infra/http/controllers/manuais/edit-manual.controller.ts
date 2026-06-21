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
import { AtualizarManualUseCase } from '../../../../domain/manuais/application/use-cases/atualizar-manual'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const editManualBodySchema = z.object({
  assunto: z.string().min(1).optional(),
  departamento: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),
  restrito: z.boolean().optional(),
})

type EditManualBody = z.infer<typeof editManualBodySchema>

@ApiTags('Manuais')
@ApiBearerAuth()
@Controller('/manuais')
@UseGuards(PermissionsGuard)
export class EditManualController {
  constructor(private atualizarManual: AtualizarManualUseCase) {}

  @Put(':id')
  @HttpCode(200)
  @RequirePermission('manuais', 'edit')
  @ApiOperation({ summary: 'Atualizar manual' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(editManualBodySchema)) body: EditManualBody,
  ) {
    const result = await this.atualizarManual.execute({
      manualId: id,
      data: body,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.manual
  }
}
