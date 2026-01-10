import { IsString, IsArray, IsOptional, IsObject, IsIn } from 'class-validator';

export class CreateGatewayDto {
    @IsString()
    name: string;

    @IsString()
    slug: string;

    @IsString()
    description: string;

    @IsString()
    @IsOptional()
    logo_url?: string;

    @IsString()
    @IsOptional()
    website_url?: string;

    @IsArray()
    @IsString({ each: true })
    countries_supported: string[];

    @IsArray()
    @IsString({ each: true })
    currencies_supported: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    crypto_supported?: string[];

    @IsArray()
    @IsString({ each: true })
    integration_type: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    business_type?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    local_payments_supported?: string[];

    // Numeric fee fields
    @IsOptional()
    local_fee_percentage?: number;

    @IsOptional()
    local_fee_fixed?: number;

    @IsOptional()
    @IsString()
    local_fee_currency?: string;

    @IsOptional()
    international_fee_percentage?: number;

    @IsOptional()
    international_fee_fixed?: number;

    @IsOptional()
    @IsString()
    international_fee_currency?: string;

    @IsOptional()
    setup_fee?: number;

    @IsOptional()
    monthly_fee?: number;

    @IsOptional()
    @IsString()
    fee_currency?: string;

    @IsOptional()
    settlement_hours?: number;

    // Legacy fee structure (optional for backward compatibility)
    @IsObject()
    @IsOptional()
    fees?: {
        transaction_fee?: string;
        setup_fee?: string;
        monthly_fee?: string;
        notes?: string;
    };

    @IsString()
    @IsOptional()
    settlement_speed?: string;

    @IsString()
    @IsOptional()
    startup_offer?: string;

    @IsString()
    @IsIn(['active', 'inactive', 'featured'])
    @IsOptional()
    status_slot?: string;
}
