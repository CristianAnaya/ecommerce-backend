import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { HasRoles } from 'src/auth/jwt/has-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-roles';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { MercadoPagoService } from './mercado_pago.service';
import { CardTokenBody } from './models/card_token_body';
import { PaymentBody } from './models/payment_body';

@Controller('mercadopago')
export class MercadoPagoController {

    constructor(private mercadoPagoService: MercadoPagoService) {}


    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('identification_types')
    getIdentificationTypes() {
        return this.mercadoPagoService.getIdentificationTypes();
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('installments/:first_six_digits/:amount')
    getInstallments(
        @Param('first_six_digits') firstSixDigits: number,
        @Param('amount') amount: number
    ) {
        return this.mercadoPagoService.getInstallments(firstSixDigits, amount);
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('card_token')
    createCardToken(@Body() cardTokenBody: CardTokenBody) {
        return this.mercadoPagoService.createCardToken(cardTokenBody);
    }   
    
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('payments')
    createPayment(@Body() paymentBody: PaymentBody) {
        return this.mercadoPagoService.createPayment(paymentBody);
    }   
}
