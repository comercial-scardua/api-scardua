import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { TestSyncHorasUseCase } from '../../../../domain/test-modules/application/use-cases/test-sync-horas'

@ApiTags('Test Modules')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class TestSyncHorasController {
  constructor(private testSyncHoras: TestSyncHorasUseCase) {}

  @Get('test-sync-horas')
  @HttpCode(200)
  @RequirePermission('test-modules', 'access')
  @ApiOperation({
    summary: 'Testar sincronização de horas — estatísticas do banco de horas',
  })
  async handle() {
    const result = await this.testSyncHoras.execute()
    return result.value!
  }
}
