import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CrearCalificacionDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  calificacion: number;

  @IsOptional()
  @IsString()
  comentario?: string;
} 