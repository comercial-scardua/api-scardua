import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DefinirPermissaoPaginaUseCase } from '../../../../domain/permissoes/application/use-cases/definir-permissao-pagina'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const definirPermissaoPaginaBodySchema = z.object({
  canAccess: z.boolean().default(false),
  canEdit: z.boolean().default(false),
  canDelete: z.boolean().default(false),
})

type DefinirPermissaoPaginaBody = z.infer<
  typeof definirPermissaoPaginaBodySchema
>

@ApiTags('Permissões')
@ApiBearerAuth()
@Controller('/permissoes')
@UseGuards(PermissionsGuard)
export class DefinirPermissaoPaginaController {
  constructor(private definirPermissaoPagina: DefinirPermissaoPaginaUseCase) {}

  @Put(':userId/:page')
  @HttpCode(200)
  @RequirePermission('permissoes', 'edit')
  @ApiOperation({ summary: 'Definir permissão de uma página específica' })
  async handle(
    @Param('userId') userId: string,
    @Param('page') page: string,
    @Body(new ZodValidationPipe(definirPermissaoPaginaBodySchema))
    body: DefinirPermissaoPaginaBody,
  ) {
    const result = await this.definirPermissaoPagina.execute(
      userId,
      page,
      body,
    )

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.permissao
  }
}
