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
import { GetPatrimonioUseCase } from '../../../../domain/patrimonios/application/use-cases/get-patrimonio'

@ApiTags('Patrimônios')
@ApiBearerAuth()
@Controller('/patrimonio')
@UseGuards(PermissionsGuard)
export class GetPatrimonioController {
  constructor(private getPatrimonio: GetPatrimonioUseCase) {}

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('patrimonio', 'access')
  @ApiOperation({ summary: 'Buscar patrimônio por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getPatrimonio.execute({ patrimonioId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { patrimonio: result.value.patrimonio }
  }
}
