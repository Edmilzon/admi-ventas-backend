import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepositorio: Repository<Usuario>,
  ) {}

  async crearUsuario(datos: CrearUsuarioDto): Promise<Usuario> {
    const usuario = new Usuario();
    usuario.nombre = datos.nombre;
    usuario.correo = datos.correo;
    usuario.contrasena = await bcrypt.hash(datos.contrasena, 10);
    usuario.direccion = datos.direccion;
    usuario.telf = datos.telf;
    return this.usuarioRepositorio.save(usuario);
  }

  async buscarPorCorreo(correo: string): Promise<Usuario | undefined> {
    const usuario = await this.usuarioRepositorio.findOne({ where: { correo } });
    return usuario ?? undefined;
  }

  async obtenerTodos(): Promise<Omit<Usuario, 'contrasena'>[]> {
    const usuarios = await this.usuarioRepositorio.find();
    return usuarios.map(({ contrasena, ...rest }) => rest);
  }

  async obtenerUno(id: number): Promise<Omit<Usuario, 'contrasena'> | undefined> {
    const usuario = await this.usuarioRepositorio.findOne({ where: { id } });
    if (!usuario) return undefined;
    const { contrasena, ...rest } = usuario;
    return rest;
  }
} 