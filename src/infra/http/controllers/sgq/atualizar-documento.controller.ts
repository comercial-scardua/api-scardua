import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AtualizarDocumentoUseCase } from '../../../../domain/sgq/application/use-cases/atualizar-documento'
import { BuscarDocumentoUseCase } from '../../../../domain/sgq/application/use-cases/buscar-documento'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const atualizarDocumentoSgqBodySchema = z.object({
  code: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  type: z
    .enum([
      'PROCEDURE',
      'WORK_INSTRUCTION',
      'FORM',
      'POLICY',
      'RECORD',
      'OTHER',
    ])
    .optional(),
  description: z.string().optional(),
  processId: z.number().int().optional(),
  processName: z.string().optional(),
  ownerId: z.string().min(1).optional(),
  ownerName: z.string().min(1).optional(),
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

type AtualizarDocumentoSgqBody = z.infer<
  typeof atualizarDocumentoSgqBodySchema
>

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class AtualizarDocumentoController {
  constructor(
    private buscarDocumento: BuscarDocumentoUseCase,
    private atualizarDocumento: AtualizarDocumentoUseCase,
  ) {}

  @Post('documents/:id')
  @HttpCode(200)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({ summary: 'Atualizar documento SGQ' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(atualizarDocumentoSgqBodySchema))
    body: AtualizarDocumentoSgqBody,
  ) {
    const doc = await this.buscarDocumento.execute(id)
    if (!doc) throw new NotFoundException(`Documento #${id} nao encontrado`)
    return this.atualizarDocumento.execute(id, body)
  }
}
