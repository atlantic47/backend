import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AdminSignupDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
