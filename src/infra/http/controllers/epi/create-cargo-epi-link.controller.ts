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
import { CriarCargoEpiLinkUseCase } from '../../../../domain/epi/application/use-cases/criar-cargo-epi-link'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const adicionarEpiCargoBodySchema = z.object({
  epi_id: z.number().int().positive(),
  periodicidade_troca_dias: z.number().int().positive(),
  quantidade_padrao: z.number().int().positive().default(1),
  obrigatorio: z.boolean().default(true),
  cargo_id: z.number().int().positive(),
})

type AdicionarEpiCargoBody = z.infer<typeof adicionarEpiCargoBodySchema>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class CreateCargoEpiLinkController {
  constructor(private criarCargoLink: CriarCargoEpiLinkUseCase) {}

  @Post('cargo-epi')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Criar vínculo EPI × Cargo' })
  @UsePipes(new ZodValidationPipe(adicionarEpiCargoBodySchema))
  async handle(@Body() body: AdicionarEpiCargoBody) {
    const result = await this.criarCargoLink.execute(body)
    if (result.isLeft()) throw new ConflictException(result.value.message)
    return result.value.link
  }
}
