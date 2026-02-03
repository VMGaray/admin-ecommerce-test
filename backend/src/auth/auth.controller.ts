import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Este es el único endpoint que necesitamos para el mini-login
  @Post('login')
  login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }
}
