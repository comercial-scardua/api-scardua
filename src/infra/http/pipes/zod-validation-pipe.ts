import { BadRequestException, type PipeTransform } from '@nestjs/common'
import { ZodError, type ZodType } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Erro de validação',
          errors: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        })
      }

      throw new BadRequestException('Erro de validação')
    }
  }
}
