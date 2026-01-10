import { IsString, IsEmail, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class CreateConsultationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    company_name?: string;

    @IsOptional()
    @IsString()
    product_description?: string;

    @IsOptional()
    @IsArray()
    business_types?: string[];

    @IsOptional()
    @IsNumber()
    monthly_volume?: number;

    @IsOptional()
    @IsNumber()
    avg_transaction_amount?: number;

    @IsOptional()
    @IsString()
    industry?: string;

    @IsOptional()
    @IsString()
    primary_region?: string;

    @IsOptional()
    @IsString()
    monthly_volume_range?: string;

    @IsOptional()
    @IsString()
    technical_framework?: string;

    @IsOptional()
    @IsArray()
    desired_payment_methods?: string[];

    @IsOptional()
    @IsString()
    current_pain_point?: string;

    @IsArray()
    @ArrayNotEmpty()
    countries_needed: string[];

    @IsArray()
    @ArrayNotEmpty()
    currencies_needed: string[];

    @IsArray()
    integration_types_preferred: string[];

    @IsOptional()
    @IsString()
    special_requirements?: string;
}
