import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado_pago.service';
import { MercadoPagoController } from './mercado_pago.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderHasProducts } from 'src/orders/order_has_products.entity';
import { Order } from 'src/orders/order.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ Order, OrderHasProducts])],
  providers: [MercadoPagoService],
  controllers: [MercadoPagoController]
})
export class MercadoPagoModule {}
