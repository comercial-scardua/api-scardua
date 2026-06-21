import {
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetResumoCaixaViagemUseCase } from '../../../../domain/caixa-viagem/application/use-cases/get-resumo-caixa-viagem'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class GetResumoController {
  constructor(private getResumoCaixaViagem: GetResumoCaixaViagemUseCase) {}

  @Post('resumo/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Resumo financeiro de um caixa de viagem' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getResumoCaixaViagem.execute({ id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.resumo
  }
}
