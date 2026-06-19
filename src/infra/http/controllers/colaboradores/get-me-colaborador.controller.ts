import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { GetColaboradorByUserUseCase } from '../../../../domain/colaboradores/application/use-cases/get-colaborador-by-user'

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('/colaboradores')
@UseGuards(PermissionsGuard)
export class GetMeColaboradorController {
  constructor(private getColaboradorByUser: GetColaboradorByUserUseCase) {}

  @Get('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Perfil do colaborador logado' })
  async handle(@CurrentUser() user: JwtPayload) {
    const result = await this.getColaboradorByUser.execute({
      userId: user.userId,
    })
    return { colaborador: result.value!.colaborador }
  }
}
