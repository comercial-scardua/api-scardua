import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CreateCargoUniformeUseCase } from '../../../../domain/uniforme/application/use-cases/create-cargo-uniforme'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createCargoUniformeBodySchema = z.object({
  cargo_id: z.coerce.number().int().positive(),
  uniforme_id: z.coerce.number().int().positive(),
  periodicidade_troca_dias: z.coerce.number().optional().nullable(),
  quantidade_padrao: z.coerce.number().optional().nullable(),
  obrigatorio: z.boolean().optional(),
})

type CreateCargoUniformeBody = z.infer<typeof createCargoUniformeBodySchema>

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/cargo-uniforme')
@UseGuards(PermissionsGuard)
export class CreateCargoUniformeController {
  constructor(private createCargoUniforme: CreateCargoUniformeUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('uniforme', 'edit')
  @ApiOperation({ summary: 'Vincular uniforme a um cargo' })
  @UsePipes(new ZodValidationPipe(createCargoUniformeBodySchema))
  async handle(@Body() body: CreateCargoUniformeBody) {
    const result = await this.createCargoUniforme.execute(body)

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }

    return result.value
  }
}
