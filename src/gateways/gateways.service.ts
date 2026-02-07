import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { PaymentGateway } from '../database/entities/payment-gateway.entity';
import { Country } from '../database/entities/country.entity';
import { Currency } from '../database/entities/currency.entity';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { FilterGatewayDto } from './dto/filter-gateway.dto';

@Injectable()
export class GatewaysService {
    constructor(
        @InjectRepository(PaymentGateway)
        private gatewayRepository: Repository<PaymentGateway>,
        @InjectRepository(Country)
        private countryRepository: Repository<Country>,
        @InjectRepository(Currency)
        private currencyRepository: Repository<Currency>,
    ) { }

    async create(createGatewayDto: CreateGatewayDto): Promise<PaymentGateway> {
        const { countries_supported, currencies_supported, ...gatewayData } = createGatewayDto;

        const gateway = this.gatewayRepository.create({
            ...gatewayData,
            approval_status: 'pending',
            status_slot: 'active', // Set to active so it appears once approved
            submitted_at: new Date(),
        });

        // Resolve Countries
        if (countries_supported && countries_supported.length > 0) {
            // Assuming frontend sends names or codes. Let's try to find by name.
            gateway.countries = await this.countryRepository.find({
                where: { name: In(countries_supported) },
            });
        }

        // Resolve Currencies
        if (currencies_supported && currencies_supported.length > 0) {
            gateway.currencies = await this.currencyRepository.find({
                where: { code: In(currencies_supported) },
            });
        }

        return await this.gatewayRepository.save(gateway);
    }

    async findAll(filterDto: FilterGatewayDto) {
        const {
            page,
            limit,
            country,
            currency,
            crypto,
            integration_type,
            search,
            min_local_fee_percentage,
            max_local_fee_percentage,
            min_international_fee_percentage,
            max_international_fee_percentage,
            max_setup_fee,
            max_monthly_fee,
            max_settlement_hours,
            business_type,
            category,
            subcategory,
            sortBy,
            sortOrder
        } = filterDto;

        const queryBuilder = this.gatewayRepository.createQueryBuilder('gateway');
        queryBuilder.leftJoinAndSelect('gateway.countries', 'country');
        queryBuilder.leftJoinAndSelect('gateway.currencies', 'currency');
        queryBuilder.leftJoinAndSelect('gateway.sponsors', 'sponsor');

        // Apply filters
        if (country) {
            queryBuilder.andWhere('country.name = :country OR country.code = :country', { country });
        }

        if (currency) {
            queryBuilder.andWhere('currency.code = :currency', { currency });
        }

        if (crypto) {
            if (crypto === 'true') {
                queryBuilder.andWhere("gateway.crypto_supported IS NOT NULL AND gateway.crypto_supported != ''");
            } else {
                queryBuilder.andWhere('FIND_IN_SET(:crypto, gateway.crypto_supported) > 0', { crypto });
            }
        }

        if (integration_type) {
            queryBuilder.andWhere('FIND_IN_SET(:integration_type, gateway.integration_type) > 0', { integration_type });
        }

        if (search) {
            queryBuilder.andWhere('(gateway.name LIKE :search OR gateway.description LIKE :search)', {
                search: `%${search}%`,
            });
        }

        // Fee range filters
        if (min_local_fee_percentage !== undefined) {
            queryBuilder.andWhere('gateway.local_fee_percentage >= :min_local_fee_percentage', { min_local_fee_percentage });
        }

        if (max_local_fee_percentage !== undefined) {
            queryBuilder.andWhere('gateway.local_fee_percentage <= :max_local_fee_percentage', { max_local_fee_percentage });
        }

        if (min_international_fee_percentage !== undefined) {
            queryBuilder.andWhere('gateway.international_fee_percentage >= :min_international_fee_percentage', { min_international_fee_percentage });
        }

        if (max_international_fee_percentage !== undefined) {
            queryBuilder.andWhere('gateway.international_fee_percentage <= :max_international_fee_percentage', { max_international_fee_percentage });
        }

        if (max_setup_fee !== undefined) {
            queryBuilder.andWhere('gateway.setup_fee <= :max_setup_fee', { max_setup_fee });
        }

        if (max_monthly_fee !== undefined) {
            queryBuilder.andWhere('gateway.monthly_fee <= :max_monthly_fee', { max_monthly_fee });
        }

        // Settlement time filter
        if (max_settlement_hours !== undefined) {
            queryBuilder.andWhere('gateway.settlement_hours <= :max_settlement_hours', { max_settlement_hours });
        }

        // Business type filter
        if (business_type) {
            queryBuilder.andWhere('FIND_IN_SET(:business_type, gateway.business_type) > 0', { business_type });
        }

        // Category filter
        if (category) {
            queryBuilder.andWhere('gateway.category = :category', { category });
        }

        // Subcategory filter
        if (subcategory) {
            queryBuilder.andWhere('FIND_IN_SET(:subcategory, gateway.subcategories) > 0', { subcategory });
        }

        // Only show active and approved gateways by default unless overridden
        queryBuilder.andWhere('gateway.status_slot IN (:...statuses)', { statuses: ['active', 'featured'] });

        if (filterDto.approval_status) {
            queryBuilder.andWhere('gateway.approval_status = :approval_status', { approval_status: filterDto.approval_status });
        } else {
            queryBuilder.andWhere('gateway.approval_status = :approval_status', { approval_status: 'approved' });
        }

        // Sorting
        queryBuilder.orderBy(`gateway.${sortBy}`, sortOrder);

        // Pagination
        const skip = ((page ?? 1) - 1) * (limit ?? 20);
        queryBuilder.skip(skip).take(limit ?? 20);

        const [items, total] = await queryBuilder.getManyAndCount();

        return {
            items,
            total,
            page: page ?? 1,
            limit: limit ?? 20,
            totalPages: Math.ceil(total / (limit ?? 20)),
        };
    }

    async findBySlug(slug: string): Promise<PaymentGateway> {
        const gateway = await this.gatewayRepository.findOne({
            where: { slug },
            relations: ['sponsors', 'offers', 'countries', 'currencies', 'pricing_structures'],
        });

        if (!gateway) {
            throw new NotFoundException(`Gateway with slug "${slug}" not found`);
        }

        return gateway;
    }

    async update(id: number, updateGatewayDto: UpdateGatewayDto): Promise<PaymentGateway> {
        const gateway = await this.gatewayRepository.findOne({ where: { id } });

        if (!gateway) {
            throw new NotFoundException(`Gateway with ID "${id}" not found`);
        }

        Object.assign(gateway, updateGatewayDto);
        return await this.gatewayRepository.save(gateway);
    }

    async remove(id: number): Promise<void> {
        const result = await this.gatewayRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Gateway with ID "${id}" not found`);
        }
    }
}
