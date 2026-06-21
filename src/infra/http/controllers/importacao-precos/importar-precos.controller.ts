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
import { ImportarPrecosUseCase } from '../../../../domain/importacao-precos/application/use-cases/importar-precos'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const importarPrecosItemSchema = z.object({
  codigoInterno: z.string().min(1),
  nome: z.string().min(1),
  categoria: z.string().min(1),
  descricao: z.string().optional().nullable(),
  unidade: z.string().min(1),
  estoqueMinimo: z.number().int().default(0),
  estoqueAtual: z.number().int().default(0),
  status: z.enum(['ATIVO', 'INATIVO']).default('ATIVO'),
})

const importarPrecosBodySchema = z.object({
  produtos: z.array(importarPrecosItemSchema).min(1),
})

type ImportarPrecosBody = z.infer<typeof importarPrecosBodySchema>

@ApiTags('Importacao de Precos')
@ApiBearerAuth()
@Controller('/importacao-precos')
@UseGuards(PermissionsGuard)
export class ImportarPrecosController {
  constructor(private importarPrecos: ImportarPrecosUseCase) {}

  @Post('importar')
  @HttpCode(201)
  @RequirePermission('importacao-precos', 'edit')
  @ApiOperation({
    summary: 'Importar precos (upsert em massa no modelo de produtos)',
  })
  @UsePipes(new ZodValidationPipe(importarPrecosBodySchema))
  async handle(@Body() body: ImportarPrecosBody) {
    const result = await this.importarPrecos.execute(body)
    return result.value!
  }
}
