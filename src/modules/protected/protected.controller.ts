import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';

@ApiTags('Protected')
@ApiBearerAuth()
@Controller('protected')
@UseGuards(PermissionsGuard)
export class ProtectedController {
  @Get()
  @HttpCode(200)
  @RequirePermission('protected', 'access')
  @ApiOperation({ summary: 'Rota protegida — retorna dados do usuário autenticado' })
  getProtected(@CurrentUser() user: JwtPayload) {
    return {
      userId: user.userId,
      role: user.role,
      message: 'Autenticado com sucesso',
    };
  }
}
