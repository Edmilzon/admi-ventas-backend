import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepositorio: Repository<Producto>,
  ) {}

  async crearProducto(datos: CrearProductoDto): Promise<Producto> {
    const producto = this.productoRepositorio.create(datos);
    return this.productoRepositorio.save(producto);
  }

  async obtenerTodos(): Promise<Producto[]> {
    return this.productoRepositorio.find();
  }

  async obtenerUno(id: number): Promise<Producto> {
    const producto = await this.productoRepositorio.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async actualizarProducto(id: number, datos: ActualizarProductoDto): Promise<Producto> {
    const producto = await this.obtenerUno(id);
    Object.assign(producto, datos);
    return this.productoRepositorio.save(producto);
  }

  async eliminarProducto(id: number): Promise<void> {
    const producto = await this.obtenerUno(id);
    await this.productoRepositorio.remove(producto);
  }
} 