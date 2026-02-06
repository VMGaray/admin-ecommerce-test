import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'; 
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
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
