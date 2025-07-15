import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CrearVentaDto } from './dto/crear-venta.dto';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  crearVenta(@Body() dto: CrearVentaDto) {
    return this.ventasService.crearVenta(dto);
  }

  @Get()
  obtenerVentas() {
    return this.ventasService.obtenerVentas();
  }

  @Get('por-dia')
  obtenerVentasPorDia(@Query('fecha') fecha: string) {
    return this.ventasService.obtenerVentasPorDia(new Date(fecha));
  }

  @Get('por-semana')
  obtenerVentasPorSemana(@Query('fecha') fecha: string) {
    return this.ventasService.obtenerVentasPorSemana(new Date(fecha));
  }

  @Get('por-producto')
  obtenerVentasPorProducto(@Query('productoId') productoId: number) {
    return this.ventasService.obtenerVentasPorProducto(Number(productoId));
  }
} 