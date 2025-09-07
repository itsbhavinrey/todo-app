import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.login({ email, password });
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // Simple session management (in production, use JWT or proper sessions)
  private currentUser: any = null;

  setCurrentUser(user: any): void {
    this.currentUser = user;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  clearCurrentUser(): void {
    this.currentUser = null;
  }
}
