import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, CategoriesModule, ProductsModule, SalesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
