import { Controller, Get, Post, Body } from '@nestjs/common'; // Asegurate de que 'Get' esté aquí
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  // REQUERIMIENTO: Endpoint para las métricas del Dashboard
  @Get('analytics')
  getAnalytics() {
    return this.salesService.getAnalytics();
  }
}
