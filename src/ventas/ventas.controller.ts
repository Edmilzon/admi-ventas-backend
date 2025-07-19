import { Controller, Post, Body, Get, Query, Patch, Param } from '@nestjs/common';
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
    return this.ventasService.obtenerVentasPorDia(fecha);
  }

  @Get('por-semana')
  obtenerVentasPorSemana(@Query('fecha') fecha: string) {
    return this.ventasService.obtenerVentasPorSemana(fecha);
  }

  @Get('por-producto')
  obtenerVentasPorProducto(@Query('productoId') productoId: number) {
    return this.ventasService.obtenerVentasPorProducto(Number(productoId));
  }

  @Get('por-semanas-del-mes')
  obtenerVentasPorSemanasDelMes(@Query('mes') mes: string, @Query('anio') anio: string) {
    return this.ventasService.obtenerVentasPorSemanasDelMes(Number(mes), Number(anio));
  }

  @Get('por-rango-fechas')
  obtenerVentasPorRangoFechas(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.ventasService.obtenerVentasPorRangoFechas(fechaInicio, fechaFin);
  }

  @Get('por-estado')
  obtenerVentasPorEstado(@Query('estado') estado: 'pendiente' | 'vendido' | 'cancelado') {
    return this.ventasService.obtenerVentasPorEstado(estado);
  }

  @Patch(':id/estado')
  actualizarEstadoVenta(@Param('id') id: string, @Body('estado') estado: 'pendiente' | 'vendido' | 'cancelado') {
    return this.ventasService.actualizarEstadoVenta(Number(id), estado);
  }
} 