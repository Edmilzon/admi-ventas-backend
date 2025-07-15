import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  crear(@Body() datos: CrearProductoDto) {
    return this.productosService.crearProducto(datos);
  }

  @Get()
  obtenerTodos() {
    return this.productosService.obtenerTodos();
  }

  @Get(':id')
  obtenerUno(@Param('id') id: number) {
    return this.productosService.obtenerUno(Number(id));
  }

  @Put(':id')
  actualizar(@Param('id') id: number, @Body() datos: ActualizarProductoDto) {
    return this.productosService.actualizarProducto(Number(id), datos);
  }

  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.productosService.eliminarProducto(Number(id));
  }
} 