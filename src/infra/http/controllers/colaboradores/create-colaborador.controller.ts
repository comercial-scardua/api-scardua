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
import type { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CriarColaboradorSchema } from '../../../../domain/colaboradores/application/dtos/colaborador-schema'
import { CreateColaboradorUseCase } from '../../../../domain/colaboradores/application/use-cases/create-colaborador'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

type CreateColaboradorBody = z.infer<typeof CriarColaboradorSchema>

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('/colaboradores')
@UseGuards(PermissionsGuard)
export class CreateColaboradorController {
  constructor(private createColaborador: CreateColaboradorUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('colaboradores', 'edit')
  @ApiOperation({ summary: 'Criar colaborador' })
  @UsePipes(new ZodValidationPipe(CriarColaboradorSchema))
  async handle(@Body() body: CreateColaboradorBody) {
    const result = await this.createColaborador.execute(body)

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }

    return { colaboradorId: result.value.colaboradorId }
  }
}
