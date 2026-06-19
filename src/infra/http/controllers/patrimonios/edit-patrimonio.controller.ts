import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { EditPatrimonioUseCase } from '../../../../domain/patrimonios/application/use-cases/edit-patrimonio'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const editPatrimonioBodySchema = z.object({
  nome: z.string().optional(),
  descricao: z.string().optional(),
  data_aquisicao: z.string().optional(),
  valor: z.string().optional(),
  status: z.string().optional(),
  fabricante: z.string().optional(),
  modelo: z.string().optional(),
  tipo: z.string().optional(),
  localizacao: z.string().optional(),
  responsavelId: z.number().int().positive().optional(),
  numeroNotaFiscal: z.string().optional(),
  dataNotaFiscal: z.string().optional(),
  dataGarantia: z.string().optional(),
  placa: z.string().optional(),
  renavan: z.string().optional(),
  anoModelo: z.number().int().optional(),
  kmEntrega: z.string().optional(),
  locado: z.boolean().optional(),
  franquia: z.string().optional(),
  proprietario: z.string().optional(),
  segurado: z.boolean().optional(),
  seguradora: z.string().optional(),
  dataVencimentoSeguro: z.string().optional(),
  numeroLinha: z.string().optional(),
  operadora: z.string().optional(),
  numeroSerie: z.string().optional(),
  oculto: z.boolean().optional(),
})

type EditPatrimonioBody = z.infer<typeof editPatrimonioBodySchema>

@ApiTags('Patrimônios')
@ApiBearerAuth()
@Controller('/patrimonio')
@UseGuards(PermissionsGuard)
export class EditPatrimonioController {
  constructor(private editPatrimonio: EditPatrimonioUseCase) {}

  @Patch(':id')
  @HttpCode(204)
  @RequirePermission('patrimonio', 'edit')
  @ApiOperation({
    summary:
      'Atualizar patrimônio (cria movimentação automática se houver mudança de responsável/localização/km)',
  })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(editPatrimonioBodySchema))
    body: EditPatrimonioBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.editPatrimonio.execute({
      patrimonioId: id,
      data: body,
      userId: user.userId,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
