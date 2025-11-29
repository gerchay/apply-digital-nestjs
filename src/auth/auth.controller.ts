import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class LoginDto {
  email: string;
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login y generación de JWT' })
  @ApiResponse({ status: 201, description: 'JWT generado correctamente.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
