import { Controller, Post, Body } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { LoginDto } from './dto/login.dto';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('login')
  async login(@Body() datos: LoginDto) {
    return this.autenticacionService.login(datos);
  }
} 