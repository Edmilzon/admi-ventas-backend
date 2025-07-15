import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from 'class-validator';

export class CrearUsuarioDto {
  @IsEmail()
  correo: string;

  @IsNotEmpty()
  nombre: string;

  @MinLength(6)
  contrasena: string;

  @IsNotEmpty()
  direccion: string;

  @IsNotEmpty()
  @IsNumberString()
  telf: string;
} 