import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
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
} 