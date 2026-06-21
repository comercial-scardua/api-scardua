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
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { CriarManualUseCase } from '../../../../domain/manuais/application/use-cases/criar-manual'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createManualBodySchema = z.object({
  assunto: z.string().min(1),
  departamento: z.string().min(1),
  descricao: z.string().min(1),
  restrito: z.boolean().default(false),
})

type CreateManualBody = z.infer<typeof createManualBodySchema>

@ApiTags('Manuais')
@ApiBearerAuth()
@Controller('/manuais')
@UseGuards(PermissionsGuard)
export class CreateManualController {
  constructor(private criarManual: CriarManualUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('manuais', 'edit')
  @ApiOperation({ summary: 'Criar manual' })
  @UsePipes(new ZodValidationPipe(createManualBodySchema))
  async handle(
    @Body() body: CreateManualBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.criarManual.execute({
      data: body,
      usuarioNome: user.email,
    })

    return result.value
  }
}
