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
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { CreateEmpresaUseCase } from '../../../../domain/empresas/application/use-cases/create-empresa'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createEmpresaBodySchema = z.object({
  nomeEmpresa: z.string().min(1),
  cnpj: z.string().optional(),
  numero: z.string().optional(),
  cidade: z.string().optional(),
})

type CreateEmpresaBody = z.infer<typeof createEmpresaBodySchema>

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('/empresas')
@UseGuards(PermissionsGuard)
export class CreateEmpresaController {
  constructor(private createEmpresa: CreateEmpresaUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('empresas', 'edit')
  @ApiOperation({ summary: 'Criar empresa' })
  @UsePipes(new ZodValidationPipe(createEmpresaBodySchema))
  async handle(
    @Body() body: CreateEmpresaBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.createEmpresa.execute({
      data: body,
      criadoPorId: user.userId,
    })

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }

    return { empresaId: result.value.empresa.id }
  }
}
