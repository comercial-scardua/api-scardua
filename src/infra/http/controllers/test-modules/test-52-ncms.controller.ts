import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { Test52NcmsUseCase } from '../../../../domain/test-modules/application/use-cases/test-52-ncms'

@ApiTags('Test Modules')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class Test52NcmsController {
  constructor(private test52Ncms: Test52NcmsUseCase) {}

  @Get('test-52-ncms')
  @HttpCode(200)
  @RequirePermission('test-modules', 'access')
  @ApiOperation({ summary: 'Testar busca de 52 NCMs' })
  async handle() {
    const result = await this.test52Ncms.execute()
    return result.value!
  }
}
