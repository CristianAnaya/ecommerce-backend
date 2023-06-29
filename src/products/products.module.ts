import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { Category } from 'src/categories/category.entity';
import { OrderHasProducts } from 'src/orders/order_has_products.entity';
import { Product } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ Product, Category, OrderHasProducts ]) ],
  controllers: [ProductsController],
  providers: [ProductsService, JwtStrategy]
})
export class ProductsModule {}
