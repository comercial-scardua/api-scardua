import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { TestBatchSizesUseCase } from '../../../../domain/test-modules/application/use-cases/test-batch-sizes'

@ApiTags('Test Modules')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class TestBatchSizesController {
  constructor(private testBatchSizes: TestBatchSizesUseCase) {}

  @Get('test-batch-sizes')
  @HttpCode(200)
  @RequirePermission('test-modules', 'access')
  @ApiOperation({ summary: 'Testar diferentes tamanhos de batch' })
  async handle() {
    const result = await this.testBatchSizes.execute()
    return result.value!
  }
}
