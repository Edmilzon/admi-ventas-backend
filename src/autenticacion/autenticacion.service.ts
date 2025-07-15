import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(datos: LoginDto) {
    const usuario = await this.usuariosService.buscarPorCorreo(datos.correo);
    if (!usuario || !(await bcrypt.compare(datos.contrasena, usuario.contrasena))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const payload = { sub: usuario.id, correo: usuario.correo };
    const token = this.jwtService.sign(payload);
    return { token };
  }
} 