import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface LoginData {
  email?: string;
  password?: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(loginDto: LoginData) {
    const { email, password } = loginDto;

    if (!email || !password) {
      throw new UnauthorizedException('Email y contraseña requeridos');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: 'fake-jwt-token',
    };
  }
}
