import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from './calificacion.entity';
import { CrearCalificacionDto } from './dto/crear-calificacion.dto';
import { Usuario } from '../usuarios/usuario.entity';
import { Producto } from '../productos/producto.entity';

@Injectable()
export class CalificacionesService {
  constructor(
    @InjectRepository(Calificacion)
    private readonly calificacionRepositorio: Repository<Calificacion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepositorio: Repository<Usuario>,
    @InjectRepository(Producto)
    private readonly productoRepositorio: Repository<Producto>,
  ) {}

  async crearCalificacion(usuarioId: number, productoId: number, dto: CrearCalificacionDto): Promise<Calificacion> {
    const usuario = await this.usuarioRepositorio.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const producto = await this.productoRepositorio.findOne({ where: { id: productoId } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const calificacion = this.calificacionRepositorio.create({
      usuario,
      producto,
      calificacion: dto.calificacion,
      comentario: dto.comentario
    });

    return this.calificacionRepositorio.save(calificacion);
  }

  async obtenerCalificacionesPorProducto(productoId: number): Promise<Calificacion[]> {
    const producto = await this.productoRepositorio.findOne({ where: { id: productoId } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    return this.calificacionRepositorio.find({
      where: { producto: { id: productoId } },
      order: { fecha: 'DESC' }
    });
  }

  async obtenerCalificacionesPorUsuario(usuarioId: number): Promise<Calificacion[]> {
    const usuario = await this.usuarioRepositorio.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return this.calificacionRepositorio.find({
      where: { usuario: { id: usuarioId } },
      order: { fecha: 'DESC' }
    });
  }

  async obtenerPromedioCalificacionProducto(productoId: number): Promise<{ promedio: number; total: number }> {
    const producto = await this.productoRepositorio.findOne({ where: { id: productoId } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const calificaciones = await this.calificacionRepositorio.find({
      where: { producto: { id: productoId } }
    });

    if (calificaciones.length === 0) {
      return { promedio: 0, total: 0 };
    }

    const suma = calificaciones.reduce((acc, cal) => acc + cal.calificacion, 0);
    const promedio = suma / calificaciones.length;

    return { promedio: Math.round(promedio * 100) / 100, total: calificaciones.length };
  }

  async actualizarCalificacion(usuarioId: number, productoId: number, dto: CrearCalificacionDto): Promise<Calificacion> {
    const calificacion = await this.calificacionRepositorio.findOne({
      where: { usuario: { id: usuarioId }, producto: { id: productoId } }
    });

    if (!calificacion) {
      throw new NotFoundException('Calificación no encontrada');
    }

    calificacion.calificacion = dto.calificacion;
    if (dto.comentario !== undefined) {
      calificacion.comentario = dto.comentario;
    }

    return this.calificacionRepositorio.save(calificacion);
  }

  async eliminarCalificacion(usuarioId: number, productoId: number): Promise<void> {
    const calificacion = await this.calificacionRepositorio.findOne({
      where: { usuario: { id: usuarioId }, producto: { id: productoId } }
    });

    if (!calificacion) {
      throw new NotFoundException('Calificación no encontrada');
    }

    await this.calificacionRepositorio.remove(calificacion);
  }
} 