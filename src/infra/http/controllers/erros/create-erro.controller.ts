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
import { CreateErroUseCase } from '../../../../domain/erros/application/use-cases/create-erro'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createErroBodySchema = z.object({
  titulo: z.string().min(1),
  categoria: z.string().min(1),
  descricao: z.string().nullish(),
  solucao: z.string().nullish(),
  usuario_id: z.number().int().positive().nullish(),
  usuario_nome: z.string().nullish(),
  tags: z.string().nullish(),
  restrito: z.boolean().default(false),
  ativo: z.boolean().default(true),
})

type CreateErroBody = z.infer<typeof createErroBodySchema>

@ApiTags('Erros')
@ApiBearerAuth()
@Controller('/erros')
@UseGuards(PermissionsGuard)
export class CreateErroController {
  constructor(private createErro: CreateErroUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('erros', 'edit')
  @ApiOperation({ summary: 'Criar erro/solução' })
  @UsePipes(new ZodValidationPipe(createErroBodySchema))
  async handle(@Body() body: CreateErroBody) {
    const result = await this.createErro.execute(body)

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { erroId: result.value.erro.id }
  }
}
