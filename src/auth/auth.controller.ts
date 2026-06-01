import { Body, Controller, Post } from '@nestjs/common';
import type { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import type { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('refresh-token')
  refreshToken(@CurrentUser('userId') userId: string) {
    return this.auth.refreshToken(userId);
  }

  @Post('verify-password')
  verifyPassword(
    @CurrentUser('userId') userId: string,
    @Body('password') password: string,
  ) {
    return this.auth.verifyPassword(userId, password);
  }
}
