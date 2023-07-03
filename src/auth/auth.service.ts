import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';
@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
        private jwtService: JwtService
    ) {}
    
    async register(user: RegisterUserDto) {

        const { email, phone } = user

        const emailExist = await this.usersRepository.findOneBy({ email: email })

        if (emailExist) {
            // 409 CONFLICT
            return new HttpException('El email ya esta registrado', HttpStatus.CONFLICT)
        }

        const phoneExist = await this.usersRepository.findOneBy( { phone: phone })

        if (phoneExist) {
            return new HttpException('El telefono ya esta registrado', HttpStatus.CONFLICT)
        }

        const newUser = this.usersRepository.create(user);
        let rolesIds = [];

        if (user.rolesIds !== undefined && user.rolesIds !== null) {
             rolesIds = user.rolesIds;
        }
        else {
            rolesIds.push('CLIENT')
        }

        const roles = await this.rolesRepository.findBy({ id: In (rolesIds) })

        newUser.roles = roles
        const userSaved = await this.usersRepository.save(newUser);
        const rolesString = userSaved.roles.map(rol => rol.id);
        const payload = { 
            id: userSaved.id,
             name: userSaved.name,
             roles: rolesString
        };

        const token = this.jwtService.sign(payload);
        const data = {
            user: userSaved,
            token: 'Bearer ' + token
        }

        delete data.user.password;

        return data;

    }

    async login(loginData: LoginAuthDto) {

        const { email, password } = loginData
        const userFound = await this.usersRepository
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where('user.email = :email', { email })
                .leftJoinAndSelect('user.roles', 'roles')
                .getOne();

        if (!userFound) {
            throw new HttpException('El email no existe', HttpStatus.NOT_FOUND)
        }

        const isPasswordValid = await compare(password, userFound.password)

        if (!isPasswordValid) {
            throw new HttpException('la contraseña es incorrecta', HttpStatus.FORBIDDEN)
        }

        const rolesIds = userFound.roles.map(rol => rol.id); // ['CLIENT', 'ADMIN']

        const payload = { id: userFound.id, name: userFound.name, roles: rolesIds }
        const token = this.jwtService.sign(payload)
        const data = {
            user: userFound,
            token: 'Bearer ' + token
        }

        delete data.user.password

        return data
    }
}
