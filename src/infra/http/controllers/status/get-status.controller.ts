import { Controller, Get, HttpCode } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '../../../../auth/decorators/public.decorator'
import { GetStatusUseCase } from '../../../../domain/status/application/use-cases/get-status'

@ApiTags('Status')
@Controller('status')
@Public()
export class GetStatusController {
  constructor(private getStatus: GetStatusUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Status da API' })
  async handle() {
    const result = await this.getStatus.execute()
    return result.value
  }
}
