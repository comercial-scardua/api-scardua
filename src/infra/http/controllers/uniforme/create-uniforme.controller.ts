import {
  Body,
  ConflictException,
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
import { CreateUniformeUseCase } from '../../../../domain/uniforme/application/use-cases/create-uniforme'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createUniformeBodySchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  tamanho: z.string().optional().nullable(),
  fabricante: z.string().optional().nullable(),
  vida_util_dias: z.coerce.number().optional().nullable(),
  estoque_atual: z.coerce.number().optional().nullable(),
  estoque_minimo: z.coerce.number().optional().nullable(),
  status: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
})

type CreateUniformeBody = z.infer<typeof createUniformeBodySchema>

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/uniformes')
@UseGuards(PermissionsGuard)
export class CreateUniformeController {
  constructor(private createUniforme: CreateUniformeUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('uniforme', 'edit')
  @ApiOperation({ summary: 'Criar uniforme' })
  @UsePipes(new ZodValidationPipe(createUniformeBodySchema))
  async handle(@Body() body: CreateUniformeBody) {
    const result = await this.createUniforme.execute(body)

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }

    return result.value
  }
}
