import { Body, Controller, Post } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {

    constructor(private rolesService: RolesService) {}

    @Post()
    create(@Body() rol: CreateRolDto) {
        return this.rolesService.create(rol)
    }
}
