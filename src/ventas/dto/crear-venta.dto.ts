import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class DetalleVentaDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio: number;
}

export class CrearVentaDto {
  @IsNumber()
  usuarioId: number;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];

  @IsOptional()
  @IsDateString()
  fechaEntrega?: string;
} 