import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Producto } from '../productos/producto.entity';

@Entity('calificaciones')
export class Calificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, { eager: true })
  usuario: Usuario;

  @ManyToOne(() => Producto, { eager: true })
  producto: Producto;

  @Column()
  calificacion: number; // 1-5 estrellas

  @Column({ nullable: true })
  comentario: string;

  @CreateDateColumn()
  fecha: Date;
} 