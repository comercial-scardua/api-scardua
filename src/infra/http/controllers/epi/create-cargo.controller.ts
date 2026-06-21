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
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarCargoBodySchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
})

type CriarCargoBody = z.infer<typeof criarCargoBodySchema>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class CreateCargoController {
  constructor(private repo: EpiRepository) {}

  @Post('cargos')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Criar cargo EPI' })
  @UsePipes(new ZodValidationPipe(criarCargoBodySchema))
  handle(@Body() body: CriarCargoBody) {
    return this.repo.createCargo(body)
  }
}
