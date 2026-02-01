import { IsString, IsNumber, IsNotEmpty, IsUUID, Min, IsOptional } from 'class-validator';


export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional() // La descripción puede ser opcional
  description?: string;

  @IsUUID() // Validamos que el ID de la categoría sea un UUID real de Supabase
  @IsNotEmpty({ message: 'Debes asignar una categoría válida' })
  categoryId: string;
}
