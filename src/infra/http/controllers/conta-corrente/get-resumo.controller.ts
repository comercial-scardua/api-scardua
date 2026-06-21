import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetResumoContaUseCase } from '../../../../domain/conta-corrente/application/use-cases/get-resumo-conta'

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class GetResumoController {
  constructor(private getResumo: GetResumoContaUseCase) {}

  @Get('resumo/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resumo financeiro de um usuário' })
  async handle(@Param('userId') userId: string) {
    const result = await this.getResumo.execute({ userId })
    return result.value
  }
}
