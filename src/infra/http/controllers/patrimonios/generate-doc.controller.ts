import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetPatrimonioUseCase } from '../../../../domain/patrimonios/application/use-cases/get-patrimonio'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const generateDocBodySchema = z.object({
  id: z.number().int().positive().optional(),
  ids: z.array(z.number().int().positive()).optional(),
})

type GenerateDocBody = z.infer<typeof generateDocBodySchema>

@ApiTags('Patrimônios')
@ApiBearerAuth()
@Controller('/patrimonio')
@UseGuards(PermissionsGuard)
export class GenerateDocController {
  constructor(private getPatrimonio: GetPatrimonioUseCase) {}

  @Post('generate-doc')
  @HttpCode(200)
  @RequirePermission('patrimonio', 'access')
  @ApiOperation({ summary: 'Gerar documentação de patrimônio em JSON' })
  @UsePipes(new ZodValidationPipe(generateDocBodySchema))
  async handle(@Body() body: GenerateDocBody) {
    const { id, ids } = body

    if (!id && !ids?.length) {
      throw new BadRequestException(
        'Informe id ou ids para gerar a documentação',
      )
    }

    const idsConsulta = ids?.length ? ids : [id as number]

    const patrimonios = await Promise.all(
      idsConsulta.map(async (patrimonioId) => {
        const result = await this.getPatrimonio.execute({ patrimonioId })
        return result.isLeft() ? null : result.value.patrimonio
      }),
    )

    const encontrados = patrimonios.filter(Boolean)

    if (!encontrados.length) {
      throw new NotFoundException('Nenhum patrimônio encontrado')
    }

    return {
      titulo: 'Documentação de Patrimônio',
      dataGeracao: new Date().toISOString(),
      total: encontrados.length,
      patrimonios: encontrados,
    }
  }
}
