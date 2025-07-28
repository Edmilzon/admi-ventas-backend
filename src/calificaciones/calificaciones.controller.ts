import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CalificacionesService } from './calificaciones.service';
import { CrearCalificacionDto } from './dto/crear-calificacion.dto';

@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Post(':productoId')
  async crearCalificacion(
    @Param('productoId') productoId: string,
    @Query('usuarioId') usuarioId: string,
    @Body() dto: CrearCalificacionDto
  ) {
    return this.calificacionesService.crearCalificacion(Number(usuarioId), Number(productoId), dto);
  }

  @Get('producto/:productoId')
  async obtenerCalificacionesPorProducto(@Param('productoId') productoId: string) {
    return this.calificacionesService.obtenerCalificacionesPorProducto(Number(productoId));
  }

  @Get('usuario/:usuarioId')
  async obtenerCalificacionesPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.calificacionesService.obtenerCalificacionesPorUsuario(Number(usuarioId));
  }

  @Get('producto/:productoId/promedio')
  async obtenerPromedioCalificacionProducto(@Param('productoId') productoId: string) {
    return this.calificacionesService.obtenerPromedioCalificacionProducto(Number(productoId));
  }

  @Put(':productoId')
  async actualizarCalificacion(
    @Param('productoId') productoId: string,
    @Query('usuarioId') usuarioId: string,
    @Body() dto: CrearCalificacionDto
  ) {
    return this.calificacionesService.actualizarCalificacion(Number(usuarioId), Number(productoId), dto);
  }

  @Delete(':productoId')
  async eliminarCalificacion(
    @Param('productoId') productoId: string,
    @Query('usuarioId') usuarioId: string
  ) {
    return this.calificacionesService.eliminarCalificacion(Number(usuarioId), Number(productoId));
  }
} 