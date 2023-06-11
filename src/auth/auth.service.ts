import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}
    
    async register(user: RegisterUserDto) {

        const emailExist = await this.usersRepository.findOneBy({ email: user.email })

        if (emailExist) {
            // 409 CONFLICT
            return new HttpException('El email ya esta registrado', HttpStatus.CONFLICT)
        }

        const phoneExist = await this.usersRepository.findOneBy( { phone: user.phone })

        if (phoneExist) {
            return new HttpException('El telefono ya esta registrado', HttpStatus.CONFLICT)
        }

        const newUser = this.usersRepository.create(user)
        return this.usersRepository.save(newUser)
    }
}
