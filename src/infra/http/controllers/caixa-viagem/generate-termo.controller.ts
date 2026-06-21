import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GenerateTermoCaixaViagemUseCase } from '../../../../domain/caixa-viagem/application/use-cases/generate-termo-caixa-viagem'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class GenerateTermoController {
  constructor(
    private generateTermoCaixaViagem: GenerateTermoCaixaViagemUseCase,
  ) {}

  @Post('generate-termo')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({
    summary: 'Gerar JSON com dados do caixa para termo de prestação de contas',
  })
  async handle(@Body('caixaViagemId') caixaViagemId: number) {
    if (!caixaViagemId) {
      throw new NotFoundException('caixaViagemId é obrigatório')
    }

    const result = await this.generateTermoCaixaViagem.execute({
      caixaViagemId,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.termo
  }
}
