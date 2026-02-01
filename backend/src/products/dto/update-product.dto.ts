import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Esto es correcto: hereda las validaciones pero las hace opcionales
export class UpdateProductDto extends PartialType(CreateProductDto) {}
