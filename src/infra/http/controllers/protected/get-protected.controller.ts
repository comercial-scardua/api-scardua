import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { GetProtectedUseCase } from '../../../../domain/protected/application/use-cases/get-protected'

@ApiTags('Protected')
@ApiBearerAuth()
@Controller('protected')
@UseGuards(PermissionsGuard)
export class GetProtectedController {
  constructor(private getProtected: GetProtectedUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('protected', 'access')
  @ApiOperation({
    summary: 'Rota protegida — retorna dados do usuário autenticado',
  })
  async handle(@CurrentUser() user: JwtPayload) {
    const result = await this.getProtected.execute(user)
    return result.value
  }
}
