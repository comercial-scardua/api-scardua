import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { ListarAniversariantesDto } from './dto/listar-aniversariantes.dto';
import { ListarAniversariantesUseCase } from './use-cases/listar-aniversariantes.use-case';

@ApiTags('Aniversariantes')
@ApiBearerAuth()
@Controller('aniversariantes')
@UseGuards(PermissionsGuard)
export class AniversariantesController {
  constructor(private listar: ListarAniversariantesUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('aniversariantes', 'access')
  @ApiOperation({
    summary:
      'Listar aniversariantes do mês (padrão: mês atual; use ?mes=1-12 para outro mês)',
  })
  findAll(@Query() query: ListarAniversariantesDto) {
    return this.listar.execute(query.mes);
  }
}
