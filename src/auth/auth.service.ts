import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface LoginPayload {
  email: string;
  password: string;
}

interface USER {
  id: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private readonly fakeUser: USER = {
    id: '1',
    email: 'admin@example.com',
    password: 'password123',
  };

  constructor(private readonly jwtService: JwtService) {}

  validateUser(email: string, password: string): USER | null {
    if (email === this.fakeUser.email && password === this.fakeUser.password) {
      return this.fakeUser;
    }
    return null;
  }

  login(payload: LoginPayload) {
    const user = this.validateUser(payload.email, payload.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(tokenPayload),
    };
  }
}
