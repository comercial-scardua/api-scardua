import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AtualizarCargoEpiUseCase } from '../../../../domain/epi/application/use-cases/atualizar-cargo-epi'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const atualizarCargoBodySchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().optional(),
})

type AtualizarCargoBody = z.infer<typeof atualizarCargoBodySchema>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class UpdateCargoController {
  constructor(private atualizarCargo: AtualizarCargoEpiUseCase) {}

  @Put('cargos/:id')
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Atualizar cargo EPI' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(atualizarCargoBodySchema))
    body: AtualizarCargoBody,
  ) {
    const result = await this.atualizarCargo.execute(id, body)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.cargo
  }
}
