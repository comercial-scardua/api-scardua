import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { TestBatch50UseCase } from '../../../../domain/test-modules/application/use-cases/test-batch-50'

@ApiTags('Test Modules')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class TestBatch50Controller {
  constructor(private testBatch50: TestBatch50UseCase) {}

  @Get('test-batch-50')
  @HttpCode(200)
  @RequirePermission('test-modules', 'access')
  @ApiOperation({ summary: 'Testar batch de 50 itens' })
  async handle() {
    const result = await this.testBatch50.execute()
    return result.value!
  }
}
