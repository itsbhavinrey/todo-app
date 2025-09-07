import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDto } from '../user/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    this.authService.setCurrentUser(user);
    return {
      message: 'Login successful',
      user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    this.authService.clearCurrentUser();
    return {
      message: 'Logout successful',
    };
  }

  @Post('me')
  @HttpCode(HttpStatus.OK)
  getCurrentUser() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return {
        message: 'No user logged in',
        user: null,
      };
    }
    return {
      message: 'Current user',
      user,
    };
  }
}
