import { IsString, IsOptional, IsInt, Min, IsIn, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterGatewayDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number = 20;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsString()
    crypto?: string;

    @IsOptional()
    @IsString()
    integration_type?: string;

    @IsOptional()
    @IsString()
    search?: string;

    // Fee range filters
    @IsOptional()
    @Type(() => Number)
    min_local_fee_percentage?: number;

    @IsOptional()
    @Type(() => Number)
    max_local_fee_percentage?: number;

    @IsOptional()
    @Type(() => Number)
    min_international_fee_percentage?: number;

    @IsOptional()
    @Type(() => Number)
    max_international_fee_percentage?: number;

    @IsOptional()
    @Type(() => Number)
    max_setup_fee?: number;

    @IsOptional()
    @Type(() => Number)
    max_monthly_fee?: number;

    // Settlement time filter
    @IsOptional()
    @Type(() => Number)
    max_settlement_hours?: number;  // e.g., 72 for "within 3 days"

    // Business type filter
    @IsOptional()
    @IsString()
    business_type?: string;  // 'Gateway', 'Processor', 'Aggregator', 'Remittance'

    @IsOptional()
    @IsString()
    @IsIn(['name', 'fit_score', 'created_at', 'local_fee_percentage', 'international_fee_percentage', 'settlement_hours'])
    sortBy?: string = 'fit_score';

    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
