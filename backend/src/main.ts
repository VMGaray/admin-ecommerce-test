import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'; // 1. Importamos el Pipe
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Activamos las validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve campos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían campos extra
      transform: true, // Convierte tipos automáticamente (ej: string a number)
    }),
  );

  // Habilitamos CORS para la conexión con el frontend
  app.enableCors();

  // Escuchamos en el puerto 3001
  await app.listen(process.env.PORT ?? 3001);

  console.log('🚀 Backend corriendo en: http://localhost:3001');
}

// Llamamos a la función y manejamos posibles errores de arranque
bootstrap().catch((err) => {
  console.error('❌ Error iniciando el servidor:', err);
  process.exit(1);
});
