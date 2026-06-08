import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status: number;
    let response: object;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      response = typeof res === 'string' ? { message: res } : (res as object);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      response = { message: 'Internal server error' };
      this.logger.error(exception);
    }

    reply.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...response,
    });
  }
}
