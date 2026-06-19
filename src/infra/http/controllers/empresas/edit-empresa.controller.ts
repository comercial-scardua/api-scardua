import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EditEmpresaUseCase } from '../../../../domain/empresas/application/use-cases/edit-empresa'
import { CnpjJaCadastradoError } from '../../../../domain/empresas/application/use-cases/errors/cnpj-ja-cadastrado.error'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const editEmpresaBodySchema = z.object({
  nomeEmpresa: z.string().min(1).optional(),
  cnpj: z.string().optional(),
  numero: z.string().optional(),
  cidade: z.string().optional(),
  oculto: z.boolean().optional(),
})

type EditEmpresaBody = z.infer<typeof editEmpresaBodySchema>

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('/empresas')
@UseGuards(PermissionsGuard)
export class EditEmpresaController {
  constructor(private editEmpresa: EditEmpresaUseCase) {}

  @Patch(':id')
  @HttpCode(204)
  @RequirePermission('empresas', 'edit')
  @ApiOperation({ summary: 'Atualizar empresa' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(editEmpresaBodySchema)) body: EditEmpresaBody,
  ) {
    const result = await this.editEmpresa.execute({ empresaId: id, data: body })

    if (result.isLeft()) {
      if (result.value instanceof CnpjJaCadastradoError) {
        throw new ConflictException(result.value.message)
      }
      throw new NotFoundException(result.value.message)
    }
  }
}
