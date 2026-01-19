import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingStructure } from '../database/entities/pricing-structure.entity';

export interface CreatePricingDto {
    gateway_id: number;
    pricing_model: string;
    local_transaction_fee_percentage?: number;
    local_transaction_fee_fixed?: number;
    international_transaction_fee_percentage?: number;
    international_transaction_fee_fixed?: number;
    monthly_fee?: number;
    setup_fee?: number;
    chargeback_fee?: number;
    currency_conversion_fee?: number;
    currency?: string;
    notes?: string;
}

export interface UpdatePricingDto {
    pricing_model?: string;
    local_transaction_fee_percentage?: number;
    local_transaction_fee_fixed?: number;
    international_transaction_fee_percentage?: number;
    international_transaction_fee_fixed?: number;
    monthly_fee?: number;
    setup_fee?: number;
    chargeback_fee?: number;
    currency_conversion_fee?: number;
    currency?: string;
    notes?: string;
}

@Injectable()
export class PricingService {
    constructor(
        @InjectRepository(PricingStructure)
        private pricingRepository: Repository<PricingStructure>,
    ) { }

    async findByGateway(gatewayId: number): Promise<PricingStructure | null> {
        return await this.pricingRepository.findOne({
            where: { gateway_id: gatewayId }
        });
    }

    async create(createPricingDto: CreatePricingDto): Promise<PricingStructure> {
        const pricing = this.pricingRepository.create(createPricingDto);
        return await this.pricingRepository.save(pricing);
    }

    async update(id: number, updatePricingDto: UpdatePricingDto): Promise<PricingStructure> {
        await this.pricingRepository.update(id, {
            ...updatePricingDto,
            last_updated: new Date()
        });
        const pricing = await this.pricingRepository.findOne({ where: { id } });
        if (!pricing) {
            throw new Error('Pricing structure not found');
        }
        return pricing;
    }

    async delete(id: number): Promise<void> {
        await this.pricingRepository.delete(id);
    }
}
