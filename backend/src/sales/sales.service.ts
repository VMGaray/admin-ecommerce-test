import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto) {
    const { productId, quantity } = createSaleDto;

    // 1. Buscamos el producto
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // 2. Validación de Stock (Funcionalidad de valor agregado)
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${quantity}`
      );
    }

    // 3. Transacción Atómica: Restar stock y registrar venta
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

      // B. Registrar la venta en la base de datos
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

  // Listado real de las ventas conectadas a la DB
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

  /**
   * MÉTRICAS PARA EL DASHBOARD:
   * Agrupa el dinero recaudado por nombre de categoría.
   */
  async getAnalytics() {
    // Traemos todas las ventas incluyendo la relación profunda hasta categorías
    const sales = await this.prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: {
              include: { category: true }
            }
          }
        }
      }
    });

    // Usamos un objeto como acumulador para sumar totales por categoría
    const categoryMap: Record<string, number> = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        const catName = item.product.category.name;
        // Sumamos (precio del momento * cantidad)
        const itemTotal = Number(item.price) * item.quantity;
        categoryMap[catName] = (categoryMap[catName] || 0) + itemTotal;
      });
    });

    // Formateamos para que Recharts (frontend) lo lea directo: [{ name: 'Tech', value: 100 }, ...]
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));
  }
}
