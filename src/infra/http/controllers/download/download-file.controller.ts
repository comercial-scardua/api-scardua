import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Response as ExpressResponse } from 'express'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DownloadFileUseCase } from '../../../../domain/download/application/use-cases/download-file'

@ApiTags('Download')
@ApiBearerAuth()
@Controller('download')
@UseGuards(PermissionsGuard)
export class DownloadFileController {
  constructor(private downloadFile: DownloadFileUseCase) {}

  @Get('*')
  @HttpCode(200)
  @RequirePermission('download', 'access')
  @ApiOperation({
    summary: 'Gerar URL assinada de download de arquivo do Supabase',
  })
  async handle(@Param('0') filePath: string, @Res() res: ExpressResponse) {
    const result = await this.downloadFile.execute({ filePath })

    if (result.isLeft()) {
      throw new InternalServerErrorException(result.value.message)
    }

    return res.redirect(result.value.signedUrl)
  }
}
