import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { CreateEventoUseCase } from '../../../../domain/eventos/application/use-cases/create-evento'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createEventoBodySchema = z.object({
  tipo: z.string().min(1),
  titulo: z.string().min(1),
  descricao: z.string().nullish(),
  dataInicio: z.union([z.string(), z.date()]).transform((v) => new Date(v)),
  dataFim: z
    .union([z.string(), z.date()])
    .transform((v) => new Date(v))
    .nullish(),
  empresaId: z.number().int().positive().nullish(),
  responsavelId: z.number().int().positive().nullish(),
  cor: z.string().nullish(),
})

type CreateEventoBody = z.infer<typeof createEventoBodySchema>

@ApiTags('Eventos')
@ApiBearerAuth()
@Controller('/eventos')
@UseGuards(PermissionsGuard)
export class CreateEventoController {
  constructor(private createEvento: CreateEventoUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('eventos', 'edit')
  @ApiOperation({ summary: 'Criar evento' })
  @UsePipes(new ZodValidationPipe(createEventoBodySchema))
  async handle(
    @Body() body: CreateEventoBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.createEvento.execute({
      ...body,
      criadoPorId: user.userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { eventoId: Number(result.value.evento.id.toString()) }
  }
}
