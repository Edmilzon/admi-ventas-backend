import { Controller, Post, Body, BadRequestException, Get, Param, NotFoundException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  async registrar(@Body() datos: CrearUsuarioDto) {
    const existente = await this.usuariosService.buscarPorCorreo(datos.correo);
    if (existente) {
      throw new BadRequestException('El correo ya está registrado');
    }
    const usuario = await this.usuariosService.crearUsuario(datos);
    return { mensaje: 'Usuario registrado correctamente', usuario: { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre } };
  }

  @Get()
  async obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Get(':id')
  async obtenerUno(@Param('id') id: string) {
    const usuario = await this.usuariosService.obtenerUno(Number(id));
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }
} 