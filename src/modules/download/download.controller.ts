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
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import { SupabaseService } from '../../common/supabase/supabase.service'

@ApiTags('Download')
@ApiBearerAuth()
@Controller('download')
@UseGuards(PermissionsGuard)
export class DownloadController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get('*')
  @HttpCode(200)
  @RequirePermission('download', 'access')
  @ApiOperation({
    summary: 'Gerar URL assinada de download de arquivo do Supabase',
  })
  async download(@Param('0') filePath: string, @Res() res: ExpressResponse) {
    try {
      const signedUrl = await this.supabase.createSignedDownloadUrl(
        'uploads',
        filePath,
      )
      return res.redirect(signedUrl)
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Erro ao gerar URL de download'
      throw new InternalServerErrorException(msg)
    }
  }
}
