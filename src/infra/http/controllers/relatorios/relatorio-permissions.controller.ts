import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetRelatorioPermissionsUseCase } from '../../../../domain/relatorios/application/use-cases/get-relatorio-permissions'
import { SetRelatorioPermissionsUseCase } from '../../../../domain/relatorios/application/use-cases/set-relatorio-permissions'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const setPermissionsBodySchema = z.object({
  userIds: z.array(z.string()).default([]),
})

type SetPermissionsBody = z.infer<typeof setPermissionsBodySchema>

@ApiTags('Relatorios')
@ApiBearerAuth()
@Controller('/relatorios')
@UseGuards(PermissionsGuard)
export class RelatorioPermissionsController {
  constructor(
    private getPermissions: GetRelatorioPermissionsUseCase,
    private setPermissions: SetRelatorioPermissionsUseCase,
  ) {}

  @Get(':id/permissions')
  @HttpCode(200)
  @RequirePermission('relatorios', 'access')
  @ApiOperation({ summary: 'Listar permissões de visualização do relatorio' })
  async list(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getPermissions.execute({ relatorioId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { permissions: result.value.permissions }
  }

  @Post(':id/permissions')
  @HttpCode(200)
  @RequirePermission('relatorios', 'edit')
  @ApiOperation({ summary: 'Definir permissões de visualização do relatorio' })
  async set(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(setPermissionsBodySchema))
    body: SetPermissionsBody,
  ) {
    const result = await this.setPermissions.execute({
      relatorioId: id,
      userIds: body.userIds,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { permissions: result.value.permissions }
  }
}
