import {
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
import { CreateDepartamentoUseCase } from '../../../../domain/uniforme/application/use-cases/create-departamento'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createDepartamentoBodySchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional().nullable(),
})

type CreateDepartamentoBody = z.infer<typeof createDepartamentoBodySchema>

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/cargos')
@UseGuards(PermissionsGuard)
export class CreateDepartamentoController {
  constructor(private createDepartamento: CreateDepartamentoUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('uniforme', 'edit')
  @ApiOperation({ summary: 'Criar departamento' })
  @UsePipes(new ZodValidationPipe(createDepartamentoBodySchema))
  async handle(@Body() body: CreateDepartamentoBody) {
    const result = await this.createDepartamento.execute(body)
    return result.value
  }
}
