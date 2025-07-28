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
    const venta = this.ventaRepositorio.create({ 
      usuario, 
      direccion: dto.direccion, 
      total, 
      detalles, 
      estado: 'pendiente',
      fechaEntrega: dto.fechaEntrega ? new Date(dto.fechaEntrega) : undefined
    });
    return this.ventaRepositorio.save(venta);
  }

  async actualizarEstadoVenta(id: number, estado: 'pendiente' | 'vendido' | 'cancelado'): Promise<Venta> {
    const venta = await this.ventaRepositorio.findOne({ where: { id } });
    if (!venta) throw new NotFoundException('Venta no encontrada');
    venta.estado = estado;
    return this.ventaRepositorio.save(venta);
  }

  async obtenerVentas(): Promise<Venta[]> {
    const ventas = await this.ventaRepositorio.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.detalles', 'detalle')
      .leftJoinAndSelect('detalle.producto', 'producto')
      .orderBy('venta.fecha', 'DESC')
      .getMany();
    return ventas.map(v => ({
      ...v,
      usuario: v.usuario ? ocultarContrasenaUsuario(v.usuario) : undefined
    }));
  }

  async obtenerVentasPorDia(fechaStr: string): Promise<Venta[]> {
    const [year, month, day] = fechaStr.split('-').map(Number);
    const inicio = new Date(year, month - 1, day, 0, 0, 0, 0);
    const fin = new Date(year, month - 1, day, 23, 59, 59, 999);
    const ventas = await this.ventaRepositorio.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.detalles', 'detalle')
      .leftJoinAndSelect('detalle.producto', 'producto')
      .where('venta.fecha BETWEEN :inicio AND :fin', { inicio, fin })
      .orderBy('venta.fecha', 'DESC')
      .getMany();
    return ventas.map(v => ({
      ...v,
      usuario: v.usuario ? ocultarContrasenaUsuario(v.usuario) : undefined
    }));
  }

  async obtenerVentasPorSemana(fechaStr: string): Promise<Venta[]> {
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    const dia = fecha.getDay();
    const diff = fecha.getDate() - dia + (dia === 0 ? -6 : 1);
    const inicio = new Date(fecha);
    inicio.setDate(diff);
    inicio.setHours(0,0,0,0);
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    fin.setHours(23,59,59,999);
    const ventas = await this.ventaRepositorio.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.detalles', 'detalle')
      .leftJoinAndSelect('detalle.producto', 'producto')
      .where('venta.fecha BETWEEN :inicio AND :fin', { inicio, fin })
      .orderBy('venta.fecha', 'DESC')
      .getMany();
    return ventas.map(v => ({
      ...v,
      usuario: v.usuario ? ocultarContrasenaUsuario(v.usuario) : undefined
    }));
  }

  async obtenerVentasPorProducto(productoId: number): Promise<Venta[]> {
    const ventas = await this.ventaRepositorio.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.detalles', 'detalle')
      .leftJoinAndSelect('detalle.producto', 'producto')
      .where('detalle.producto = :productoId', { productoId })
      .orderBy('venta.fecha', 'DESC')
      .getMany();
    return ventas.map(v => ({
      ...v,
      usuario: v.usuario ? ocultarContrasenaUsuario(v.usuario) : undefined
    }));
  }

  async obtenerVentasPorSemanasDelMes(mes: number, anio: number): Promise<Venta[][]> {
    const primerDia = new Date(anio, mes - 1, 1, 0, 0, 0, 0);
    const ultimoDia = new Date(anio, mes, 0, 23, 59, 59, 999);
    const ventas = await this.ventaRepositorio.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.detalles', 'detalle')
      .leftJoinAndSelect('detalle.producto', 'producto')
      .where('venta.fecha BETWEEN :inicio AND :fin', { inicio: primerDia, fin: ultimoDia })
      .orderBy('venta.fecha', 'DESC')
      .getMany();
    const semanas: Venta[][] = [];
    let inicioSemana = new Date(primerDia);
    let finSemana = new Date(primerDia);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23,59,59,999);
    while (inicioSemana <= ultimoDia) {
      const ventasSemana = ventas.filter(v => v.fecha >= inicioSemana && v.fecha <= finSemana);
      semanas.push(ventasSemana.map(v => ({
        ...v,
        usuario: v.usuario ? ocultarContrasenaUsuario(v.usuario) : undefined
      })));
      inicioSemana = new Date(finSemana);
      inicioSemana.setDate(inicioSemana.getDate() + 1);
      inicioSemana.setHours(0,0,0,0);
      finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      finSemana.setHours(23,59,59,999);
      if (finSemana > ultimoDia) finSemana = new Date(ultimoDia);
    }
    return semanas.filter(arr => arr.length > 0);
  }

  async obtenerVentasPorRangoFechas(fechaInicioStr: string, fechaFinStr: string): Promise<Venta[]> {
    const [y1, m1, d1] = fechaInicioStr.split('-').map(Number);
    const [y2, m2, d2] = fechaFinStr.split('-').map(Number);
    const inicio = new Date(y1, m1 - 1, d1, 0, 0, 0, 0);
    const fin = new Date(y2, m2 - 1, d2, 23, 59, 59, 999);
    const ventas = await this.ventaRepositorio.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.detalles', 'detalle')
      .leftJoinAndSelect('detalle.producto', 'producto')
      .where('venta.fecha BETWEEN :inicio AND :fin', { inicio, fin })
      .orderBy('venta.fecha', 'DESC')
      .getMany();
    return ventas.map(v => ({
      ...v,
      usuario: v.usuario ? ocultarContrasenaUsuario(v.usuario) : undefined
    }));
  }

  async obtenerVentasPorEstado(estado: 'pendiente' | 'vendido' | 'cancelado'): Promise<Venta[]> {
    const ventas = await this.ventaRepositorio.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .leftJoinAndSelect('venta.detalles', 'detalle')
      .leftJoinAndSelect('detalle.producto', 'producto')
      .where('venta.estado = :estado', { estado })
      .orderBy('venta.fecha', 'DESC')
      .getMany();
    return ventas.map(v => ({
      ...v,
      usuario: v.usuario ? ocultarContrasenaUsuario(v.usuario) : undefined
    }));
  }
}

// Helper para ocultar la contraseña del usuario
function ocultarContrasenaUsuario(usuario: any) {
  const { contrasena, ...rest } = usuario;
  return rest;
} 