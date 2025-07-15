import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CrearProductoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsNumber()
  @Min(0)
  stock: number;
} 