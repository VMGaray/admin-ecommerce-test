import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Definimos la interfaz para que TypeScript no adivine (Nivel Senior)
interface LoginData {
  email?: string;
  password?: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(loginDto: LoginData) {
    const { email, password } = loginDto;

    // 1. Verificación de seguridad básica
    if (!email || !password) {
      throw new UnauthorizedException('Email y contraseña requeridos');
    }

    // 2. Buscamos al usuario en Supabase
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 3. Validamos existencia y contraseña
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 4. Si todo está bien, retornamos el objeto limpio
    // Esto quita los errores de "Unsafe assignment" de tu imagen
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: 'fake-jwt-token',
    };
  }
}
