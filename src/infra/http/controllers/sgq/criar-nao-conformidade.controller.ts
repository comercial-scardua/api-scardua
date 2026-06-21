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
import { CriarNaoConformidadeUseCase } from '../../../../domain/sgq/application/use-cases/criar-nao-conformidade'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarNcSgqBodySchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  origin: z.enum([
    'INTERNAL',
    'EXTERNAL',
    'AUDIT',
    'CUSTOMER_COMPLAINT',
    'INTERNAL_AUDIT',
  ]),
  processId: z.number().int().optional(),
  processName: z.string().optional(),
  ownerId: z.string().min(1),
  ownerName: z.string().min(1),
  openingDate: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  closureDate: z.coerce.date().optional(),
  status: z
    .enum(['OPEN', 'ANALYSIS', 'ACTION', 'VERIFICATION', 'CLOSED'])
    .optional(),
  rootCauseAnalysis: z.string().optional(),
  immediateAction: z.string().optional(),
  evidenceFiles: z.string().optional(),
  closureNotes: z.string().optional(),
  createdBy: z.string().optional(),
})

type CriarNcSgqBody = z.infer<typeof criarNcSgqBodySchema>

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class CriarNaoConformidadeController {
  constructor(private criarNaoConformidade: CriarNaoConformidadeUseCase) {}

  @Post('non-conformities')
  @HttpCode(201)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({ summary: 'Criar nao-conformidade SGQ' })
  @UsePipes(new ZodValidationPipe(criarNcSgqBodySchema))
  async handle(@Body() body: CriarNcSgqBody) {
    return this.criarNaoConformidade.execute(body)
  }
}
