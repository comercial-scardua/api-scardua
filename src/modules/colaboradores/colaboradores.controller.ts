import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import type { CriarColaboradorDto } from './dto/criar-colaborador.dto';
import type { ColaboradoresRepository } from './repositories/colaboradores.repository';
import type { BuscarColaboradorUseCase } from './use-cases/buscar-colaborador.use-case';
import type { ListarColaboradoresUseCase } from './use-cases/listar-colaboradores.use-case';

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('colaboradores')
@UseGuards(PermissionsGuard)
export class ColaboradoresController {
  constructor(
    private listar: ListarColaboradoresUseCase,
    private buscar: BuscarColaboradorUseCase,
    private repo: ColaboradoresRepository,
  ) {}

  @Get()
  @RequirePermission('colaboradores', 'access')
  @ApiOperation({ summary: 'Listar colaboradores' })
  @ApiQuery({ name: 'cpf', required: false })
  @ApiQuery({ name: 'simple', required: false, type: Boolean })
  findAll(@Query('cpf') cpf?: string, @Query('simple') simple?: boolean) {
    return this.listar.execute(cpf, simple);
  }

  @Get('me')
  @ApiOperation({ summary: 'Perfil do colaborador logado' })
  findMe(@CurrentUser() user: JwtPayload) {
    return this.repo.findByEmail(user.email);
  }

  @Get(':id')
  @RequirePermission('colaboradores', 'access')
  @ApiOperation({ summary: 'Buscar colaborador por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.buscar.execute(id);
  }

  @Post()
  @RequirePermission('colaboradores', 'edit')
  @ApiOperation({ summary: 'Criar colaborador' })
  create(@Body() dto: CriarColaboradorDto) {
    return this.repo.create(dto);
  }

  @Patch(':id')
  @RequirePermission('colaboradores', 'edit')
  @ApiOperation({ summary: 'Atualizar colaborador' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CriarColaboradorDto>,
  ) {
    return this.repo.update(id, dto);
  }
}
