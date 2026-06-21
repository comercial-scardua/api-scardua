import {
  Body,
  Controller,
  HttpCode,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { UpsertGestorEmpresaUseCase } from '../../../../domain/gestor-empresas/application/use-cases/upsert-gestor-empresa'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const upsertGestorEmpresaBodySchema = z.object({
  colaboradorId: z.number().int().positive(),
  empresaId: z.number().int().positive(),
})

type UpsertGestorEmpresaBody = z.infer<typeof upsertGestorEmpresaBodySchema>

@ApiTags('Gestor Empresas')
@ApiBearerAuth()
@Controller('/gestor-empresas')
@UseGuards(PermissionsGuard)
export class UpsertGestorEmpresaController {
  constructor(private upsertGestorEmpresa: UpsertGestorEmpresaUseCase) {}

  @Put()
  @HttpCode(200)
  @RequirePermission('gestor-empresas', 'edit')
  @ApiOperation({ summary: 'Upsert gestor de empresa' })
  @UsePipes(new ZodValidationPipe(upsertGestorEmpresaBodySchema))
  async handle(@Body() body: UpsertGestorEmpresaBody) {
    const result = await this.upsertGestorEmpresa.execute(body)
    return result.value?.gestor
  }
}
