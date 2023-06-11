import { IsEmail, isEmail, IsNotEmpty, IsString, isString } from "class-validator";

export class LoginAuthDto {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;//TEST

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    password: string;
}