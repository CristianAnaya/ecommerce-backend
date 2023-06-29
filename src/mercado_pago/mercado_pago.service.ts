import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError, AxiosResponse } from 'axios';
import { response } from 'express';
import { catchError, map, Observable } from 'rxjs';
import { MERCADO_PAGO_API, MERCADO_PAGO_HEADERS } from 'src/config/config';
import { Order } from 'src/orders/order.entity';
import { OrderHasProducts } from 'src/orders/order_has_products.entity';
import { Repository } from 'typeorm';
import { CardTokenBody } from './models/card_token_body';
import { CardTokenResponse } from './models/card_token_response';
import { IdentificationType } from './models/identification_type';
import { Installment, PayerCost } from './models/installment';
import { PaymentBody } from './models/payment_body';
import { PaymentResponse } from './models/payment_response';

@Injectable()
export class MercadoPagoService {

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Order) private ordersRepository: Repository<Order>,
        @InjectRepository(OrderHasProducts) private orderHasProductsRepository: Repository<OrderHasProducts>
        ) {}

    getIdentificationTypes(): Observable<AxiosResponse<IdentificationType[]>> {
        return this.httpService.get(MERCADO_PAGO_API + '/identification_types', { headers: MERCADO_PAGO_HEADERS }).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.response.data, error.response.status)
            })
        ).pipe(map((resp) => resp.data));
    }

    getInstallments(firstSixDigits: number, amount: number): Observable<Installment> {
        return this.httpService.get(MERCADO_PAGO_API + `/payment_methods/installments?bin=${firstSixDigits}&amount=${amount}`, { headers: MERCADO_PAGO_HEADERS }).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.response.data, error.response.status);
            })
        ).pipe(map((resp: AxiosResponse<Installment>) => resp.data[0]));
    }

    createCardToken(cardTokenBody: CardTokenBody): Observable<CardTokenResponse> {
        return this.httpService.post(
            MERCADO_PAGO_API + `/card_tokens?public_key=TEST-43384a7f-b481-472e-9909-9be968b949e3`,
            cardTokenBody,
             { headers: MERCADO_PAGO_HEADERS }).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.response.data, error.response.status)
            })
        ).pipe(map((resp: AxiosResponse<CardTokenResponse>) => resp.data));
    }

    async createPayment(paymentBody: PaymentBody): Promise<Observable<PaymentResponse>> {
        const newOrder = await this.ordersRepository.create(paymentBody.order);
        const savedOrder= await this.ordersRepository.save(newOrder);

        for(const product of paymentBody.order.products) {
            const ohp = new OrderHasProducts();
            ohp.id_order = savedOrder.id;
            ohp.id_product = product.id;
            ohp.quantity = product.quantity
            await this.orderHasProductsRepository.save(ohp)
        }
        delete paymentBody.order;

        return this.httpService.post(
            MERCADO_PAGO_API + '/payments',
            paymentBody,
             { headers: MERCADO_PAGO_HEADERS }).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.response.data, error.response.status)
            })
        ).pipe(map((resp: AxiosResponse<PaymentResponse>) => resp.data));
    }
}
 