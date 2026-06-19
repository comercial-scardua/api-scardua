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
import { GetErroUseCase } from '../../../../domain/erros/application/use-cases/get-erro'

@ApiTags('Erros')
@ApiBearerAuth()
@Controller('/erros')
@UseGuards(PermissionsGuard)
export class GetErroController {
  constructor(private getErro: GetErroUseCase) {}

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('erros', 'access')
  @ApiOperation({ summary: 'Buscar erro/solução por ID com arquivos' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getErro.execute({ erroId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { erro: result.value.erro }
  }
}
