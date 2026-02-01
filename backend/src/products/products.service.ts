import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Inyectamos tu conector
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  // Inyectamos PrismaService en el constructor
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return await this.prisma.product.findMany({
      // El toque Senior: traemos la categoría asociada para no hacer 
      // peticiones extra desde el frontend (Eager Loading)
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }
}
