import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { randomUUID } from 'node:crypto'
import { SupabaseService } from '../../../../common/supabase/supabase.service'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'

@ApiTags('Contratos')
@ApiBearerAuth()
@Controller('/contratos')
@UseGuards(PermissionsGuard)
export class UploadUrlContratoController {
  constructor(private supabase: SupabaseService) {}

  @Post('upload-url')
  @HttpCode(200)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({
    summary: 'Gerar URL assinada para upload direto ao Supabase',
  })
  async handle(@Body('path') path?: string) {
    const filePath =
      path ?? `contratos/${Date.now()}_${randomUUID().slice(0, 8)}`
    return this.supabase.getSignedUploadUrl('uploads', filePath)
  }
}
