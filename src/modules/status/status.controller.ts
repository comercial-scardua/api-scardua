import { Controller, Get, HttpCode } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '../../auth/decorators/public.decorator'

@ApiTags('Status')
@Controller('status')
@Public()
export class StatusController {
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Status da API' })
  getStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }
  }
}
