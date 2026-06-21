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
import { CriarProcessoUseCase } from '../../../../domain/sgq/application/use-cases/criar-processo'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarProcessoSgqBodySchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
  ownerId: z.string().min(1),
  ownerName: z.string().min(1),
  createdBy: z.string().optional(),
})

type CriarProcessoSgqBody = z.infer<typeof criarProcessoSgqBodySchema>

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class CriarProcessoController {
  constructor(private criarProcesso: CriarProcessoUseCase) {}

  @Post('processes')
  @HttpCode(201)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({ summary: 'Criar processo SGQ' })
  @UsePipes(new ZodValidationPipe(criarProcessoSgqBodySchema))
  async handle(@Body() body: CriarProcessoSgqBody) {
    return this.criarProcesso.execute(body)
  }
}
