import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CompareNcmQueriesUseCase } from '../../../../domain/ncm-utilities/application/use-cases/compare-ncm-queries'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const compareNcmQueriesBodySchema = z.object({
  query1: z.string().optional(),
  query2: z.string().optional(),
})

type CompareNcmQueriesBody = z.infer<typeof compareNcmQueriesBodySchema>

@ApiTags('NCM Utilities')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class CompareNcmQueriesController {
  constructor(private compareNcmQueries: CompareNcmQueriesUseCase) {}

  @Post('compare-ncm-queries')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'edit')
  @ApiOperation({ summary: 'Comparar duas queries NCM (diagnostico interno)' })
  @UsePipes(new ZodValidationPipe(compareNcmQueriesBodySchema))
  async handle(@Body() body: CompareNcmQueriesBody) {
    const result = await this.compareNcmQueries.execute({
      query1: body.query1,
      query2: body.query2,
    })
    return result.value
  }
}
