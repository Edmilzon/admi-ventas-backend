import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { CrearVentaDto } from './dto/crear-venta.dto';
import { Usuario } from '../usuarios/usuario.entity';
import { Producto } from '../productos/producto.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepositorio: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepositorio: Repository<DetalleVenta>,
    @InjectRepository(Usuario)
    private readonly usuarioRepositorio: Repository<Usuario>,
    @InjectRepository(Producto)
    private readonly productoRepositorio: Repository<Producto>,
  ) {}

  async crearVenta(dto: CrearVentaDto): Promise<Venta> {
    const usuario = await this.usuarioRepositorio.findOne({ where: { id: dto.usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    let total = 0;
    const detalles: DetalleVenta[] = [];
    for (const d of dto.detalles) {
      const producto = await this.productoRepositorio.findOne({ where: { id: d.productoId } });
      if (!producto) throw new NotFoundException('Producto no encontrado');
      total += d.precio * d.cantidad;
      const detalle = this.detalleVentaRepositorio.create({ producto, cantidad: d.cantidad, precio: d.precio });
      detalles.push(detalle);
    }
    const venta = this.ventaRepositorio.create({ usuario, direccion: dto.direccion, total, detalles });
    return this.ventaRepositorio.save(venta);
  }

  async obtenerVentas(): Promise<Venta[]> {
    return this.ventaRepositorio.find();
  }

  async obtenerVentasPorDia(fecha: Date): Promise<Venta[]> {
    const inicio = new Date(fecha);
    inicio.setHours(0,0,0,0);
    const fin = new Date(fecha);
    fin.setHours(23,59,59,999);
    return this.ventaRepositorio.createQueryBuilder('venta')
      .where('venta.fecha BETWEEN :inicio AND :fin', { inicio, fin })
      .getMany();
  }

  async obtenerVentasPorSemana(fecha: Date): Promise<Venta[]> {
    const inicio = new Date(fecha);
    const dia = inicio.getDay();
    const diff = inicio.getDate() - dia + (dia === 0 ? -6 : 1);
    inicio.setDate(diff);
    inicio.setHours(0,0,0,0);
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    fin.setHours(23,59,59,999);
    return this.ventaRepositorio.createQueryBuilder('venta')
      .where('venta.fecha BETWEEN :inicio AND :fin', { inicio, fin })
      .getMany();
  }

  async obtenerVentasPorProducto(productoId: number): Promise<Venta[]> {
    return this.ventaRepositorio.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.detalles', 'detalle')
      .where('detalle.producto = :productoId', { productoId })
      .getMany();
  }
} 