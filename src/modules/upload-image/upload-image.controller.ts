import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { SupabaseService } from '../../common/supabase/supabase.service';

@ApiTags('Upload Image')
@ApiBearerAuth()
@Controller('upload-image')
@UseGuards(PermissionsGuard)
export class UploadImageController {
  constructor(private readonly supabase: SupabaseService) {}

  @Post()
  @HttpCode(200)
  @RequirePermission('upload-image', 'edit')
  @UseInterceptors(FileInterceptor('image', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Upload de imagem para o Supabase' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('Arquivo de imagem não enviado');
    }

    const path = `images/${Date.now()}_${file.originalname}`;
    const url = await this.supabase.upload('uploads', path, file.buffer, file.mimetype);

    return { url };
  }
}
