import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './venta.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Usuario } from '../usuarios/usuario.entity';
import { Producto } from '../productos/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta, Usuario, Producto])],
  providers: [VentasService],
  controllers: [VentasController],
})
export class VentasModule {} 