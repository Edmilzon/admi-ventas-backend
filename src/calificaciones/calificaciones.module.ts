import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calificacion } from './calificacion.entity';
import { CalificacionesService } from './calificaciones.service';
import { CalificacionesController } from './calificaciones.controller';
import { Usuario } from '../usuarios/usuario.entity';
import { Producto } from '../productos/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calificacion, Usuario, Producto])],
  providers: [CalificacionesService],
  controllers: [CalificacionesController],
})
export class CalificacionesModule {} 