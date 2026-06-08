import { BadRequestException, Body, ConflictException, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import type { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login com email e senha' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Public()
  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar novo usuário' })
  async register(
    @Body() dto: { nome: string; sobrenome: string; email: string; cpf: string; password: string },
  ) {
    try {
      return await this.auth.register(dto);
    } catch (e: any) {
      if (e instanceof ConflictException) throw e;
      throw e;
    }
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout (cliente deve descartar o token)' })
  logout() {
    return this.auth.logout();
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Renovar token JWT' })
  refreshToken(@CurrentUser('userId') userId: string) {
    return this.auth.refreshToken(userId);
  }

  @Post('refresh-permissions')
  @ApiOperation({ summary: 'Renovar token com dados atualizados do usuário' })
  refreshPermissions(@CurrentUser('userId') userId: string) {
    return this.auth.refreshPermissions(userId);
  }

  @Post('verify-password')
  @ApiOperation({ summary: 'Verificar senha atual do usuário logado' })
  verifyPassword(
    @CurrentUser('userId') userId: string,
    @Body('password') password: string,
  ) {
    return this.auth.verifyPassword(userId, password);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Redefinir senha (requer senha atual)' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto);
  }

  @Public()
  @Get('verify-username')
  @ApiOperation({ summary: 'Verificar se nome/email de usuário existe' })
  verifyUsername(@Query('username') username: string) {
    if (!username) throw new BadRequestException('Parâmetro "username" é obrigatório');
    return this.auth.verifyUsername(username);
  }
}
