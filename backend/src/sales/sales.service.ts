import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto) {
    const { productId, quantity } = createSaleDto;

    // 1. Buscamos el producto [cite: 13]
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // 2. Validación de Stock (Funcionalidad adicional) 
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${quantity}`
      );
    }

    // 3. Transacción Atómica: Restar stock y registrar venta [cite: 14]
    return this.prisma.$transaction(async (tx) => {
      // A. Decrementar stock automáticamente
      await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });

      // B. Registrar la venta en la base de datos [cite: 13]
      return tx.sale.create({
        data: {
          total: Number(product.price) * quantity,
          items: {
            create: {
              productId: product.id,
              quantity: quantity,
              price: product.price,
            },
          },
        },
        include: { items: true },
      });
    });
  }

  // Listado real de las ventas conectadas a la DB [cite: 13, 15]
  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
