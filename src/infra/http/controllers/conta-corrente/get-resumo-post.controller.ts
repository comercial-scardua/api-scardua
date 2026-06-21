import { Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetResumoContaUseCase } from '../../../../domain/conta-corrente/application/use-cases/get-resumo-conta'

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class GetResumoPostController {
  constructor(private getResumo: GetResumoContaUseCase) {}

  @Post('resumo/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resumo financeiro de um usuário (POST alias)' })
  async handle(@Param('userId') userId: string) {
    const result = await this.getResumo.execute({ userId })
    return result.value
  }
}
