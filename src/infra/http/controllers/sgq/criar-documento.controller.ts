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
import { CriarDocumentoUseCase } from '../../../../domain/sgq/application/use-cases/criar-documento'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarDocumentoSgqBodySchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  type: z.enum([
    'PROCEDURE',
    'WORK_INSTRUCTION',
    'FORM',
    'POLICY',
    'RECORD',
    'OTHER',
  ]),
  description: z.string().optional(),
  processId: z.number().int().optional(),
  processName: z.string().optional(),
  ownerId: z.string().min(1),
  ownerName: z.string().min(1),
  currentVersion: z.string().optional(),
  status: z
    .enum(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ARCHIVED', 'OBSOLETE'])
    .optional(),
  issueDate: z.coerce.date().optional(),
  reviewDate: z.coerce.date().optional(),
  fileUrl: z.string().optional(),
  attachments: z.string().optional(),
  approvedById: z.string().optional(),
  approvedByName: z.string().optional(),
  approvalDate: z.coerce.date().optional(),
  approvalComments: z.string().optional(),
  createdBy: z.string().optional(),
})

type CriarDocumentoSgqBody = z.infer<typeof criarDocumentoSgqBodySchema>

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class CriarDocumentoController {
  constructor(private criarDocumento: CriarDocumentoUseCase) {}

  @Post('documents')
  @HttpCode(201)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({ summary: 'Criar documento SGQ' })
  @UsePipes(new ZodValidationPipe(criarDocumentoSgqBodySchema))
  async handle(@Body() body: CriarDocumentoSgqBody) {
    return this.criarDocumento.execute(body)
  }
}
