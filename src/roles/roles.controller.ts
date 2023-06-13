import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { HasRoles } from 'src/auth/jwt/has-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-roles';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { CreateRolDto } from './dto/create-rol.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {

    constructor(private rolesService: RolesService) {}

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    create(@Body() rol: CreateRolDto) {
        return this.rolesService.create(rol)
    }
}
