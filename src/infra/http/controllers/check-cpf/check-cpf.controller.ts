import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CheckCpfUseCase } from '../../../../domain/check-cpf/application/use-cases/check-cpf'

@ApiTags('Check CPF')
@ApiBearerAuth()
@Controller('check-cpf')
@UseGuards(PermissionsGuard)
export class CheckCpfController {
  constructor(private checkCpf: CheckCpfUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('check-cpf', 'access')
  @ApiOperation({ summary: 'Validar CPF e verificar se já existe no sistema' })
  @ApiQuery({
    name: 'cpf',
    required: true,
    description: 'CPF (somente dígitos, 11 caracteres)',
  })
  async handle(@Query('cpf') cpf: string) {
    if (!cpf) {
      throw new BadRequestException('Parâmetro cpf é obrigatório')
    }

    const result = await this.checkCpf.execute({ cpf })
    return result.value
  }
}
