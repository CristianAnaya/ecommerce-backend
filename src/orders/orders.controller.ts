import { Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { HasRoles } from 'src/auth/jwt/has-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-roles';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {

    constructor(private ordersService: OrdersService) {}

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    findAll() {
        return this.ordersService.findAll();
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get(':id_client')
    findByClient(@Param('id_client', ParseIntPipe) idClient: number) {
        return this.ordersService.findByClient(idClient);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id')
    updateStatus(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.updateStatus(id);
    }

}
