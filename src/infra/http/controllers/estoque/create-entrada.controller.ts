import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { CriarEntradaUseCase } from '../../../../domain/estoque/application/use-cases/criar-entrada'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarEntradaSchema = z.object({
  produtoId: z.number().int().positive(),
  empresaId: z.number().int().positive().optional().nullable(),
  quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
  dataEntrada: z.string(),
  numeroNotaFiscal: z.string().optional(),
  observacoes: z.string().optional(),
})

type CriarEntradaBody = z.infer<typeof criarEntradaSchema>

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class CreateEntradaController {
  constructor(private criarEntrada: CriarEntradaUseCase) {}

  @Post('entradas')
  @HttpCode(201)
  @RequirePermission('estoque', 'edit')
  @UseInterceptors(
    FileInterceptor('arquivo', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Registrar entrada de estoque (transação atômica, upload NF opcional)',
  })
  async handle(
    @Body(new ZodValidationPipe(criarEntradaSchema)) body: CriarEntradaBody,
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.criarEntrada.execute(body, user.userId, file)

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.entrada
  }
}
