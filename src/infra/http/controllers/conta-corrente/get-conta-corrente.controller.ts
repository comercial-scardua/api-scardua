import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetContaCorrenteUseCase } from '../../../../domain/conta-corrente/application/use-cases/get-conta-corrente'

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class GetContaCorrenteController {
  constructor(private getContaCorrente: GetContaCorrenteUseCase) {}

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Buscar conta corrente por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getContaCorrente.execute({ id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.conta
  }
}
