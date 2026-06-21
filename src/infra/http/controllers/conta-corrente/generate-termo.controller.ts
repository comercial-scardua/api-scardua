import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GenerateTermoContaUseCase } from '../../../../domain/conta-corrente/application/use-cases/generate-termo-conta'

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class GenerateTermoController {
  constructor(private generateTermo: GenerateTermoContaUseCase) {}

  @Post('generate-termo')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Gerar termo de conta corrente em JSON' })
  async handle(@Body('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId é obrigatório')

    const result = await this.generateTermo.execute({ userId })
    return result.value
  }
}
