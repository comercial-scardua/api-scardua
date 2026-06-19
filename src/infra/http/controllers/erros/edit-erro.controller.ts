import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EditErroUseCase } from '../../../../domain/erros/application/use-cases/edit-erro'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const editErroBodySchema = z.object({
  titulo: z.string().min(1).optional(),
  categoria: z.string().min(1).optional(),
  descricao: z.string().nullish(),
  solucao: z.string().nullish(),
  usuario_id: z.number().int().positive().nullish(),
  usuario_nome: z.string().nullish(),
  tags: z.string().nullish(),
  restrito: z.boolean().optional(),
  ativo: z.boolean().optional(),
})

type EditErroBody = z.infer<typeof editErroBodySchema>

@ApiTags('Erros')
@ApiBearerAuth()
@Controller('/erros')
@UseGuards(PermissionsGuard)
export class EditErroController {
  constructor(private editErro: EditErroUseCase) {}

  @Post(':id')
  @HttpCode(204)
  @RequirePermission('erros', 'edit')
  @ApiOperation({ summary: 'Atualizar erro/solução' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(editErroBodySchema)) body: EditErroBody,
  ) {
    const result = await this.editErro.execute({ erroId: id, data: body })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
