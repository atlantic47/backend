import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentGateway } from '../database/entities/payment-gateway.entity';
import { Sponsor } from '../database/entities/sponsor.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(PaymentGateway)
        private gatewayRepository: Repository<PaymentGateway>,
        @InjectRepository(Sponsor)
        private sponsorRepository: Repository<Sponsor>,
    ) { }

    // Gateway methods
    async getPendingGateways() {
        return this.gatewayRepository.find({
            where: { approval_status: 'pending' },
            relations: ['countries', 'currencies'],
            order: { submitted_at: 'DESC' },
        });
    }

    async approveGateway(id: number, adminId: string) {
        const gateway = await this.gatewayRepository.findOne({ where: { id } });
        if (!gateway) {
            throw new Error('Gateway not found');
        }

        gateway.approval_status = 'approved';
        gateway.reviewed_at = new Date();
        gateway.reviewed_by = adminId;

        return this.gatewayRepository.save(gateway);
    }

    async rejectGateway(id: number, adminId: string) {
        const gateway = await this.gatewayRepository.findOne({ where: { id } });
        if (!gateway) {
            throw new Error('Gateway not found');
        }

        gateway.approval_status = 'rejected';
        gateway.reviewed_at = new Date();
        gateway.reviewed_by = adminId;

        return this.gatewayRepository.save(gateway);
    }

    // Sponsor methods
    async getPendingSponsors() {
        return this.sponsorRepository.find({
            where: { approval_status: 'pending' },
            relations: ['gateway'],
            order: { submitted_at: 'DESC' },
        });
    }

    async approveSponsor(id: number, adminId: string) {
        const sponsor = await this.sponsorRepository.findOne({
            where: { id },
            relations: ['gateway']
        });
        if (!sponsor) {
            throw new Error('Sponsor not found');
        }

        sponsor.approval_status = 'approved';
        sponsor.reviewed_at = new Date();
        sponsor.reviewed_by = adminId;
        sponsor.status = 'active';

        return this.sponsorRepository.save(sponsor);
    }

    async rejectSponsor(id: number, adminId: string) {
        const sponsor = await this.sponsorRepository.findOne({
            where: { id },
            relations: ['gateway']
        });
        if (!sponsor) {
            throw new Error('Sponsor not found');
        }

        sponsor.approval_status = 'rejected';
        sponsor.reviewed_at = new Date();
        sponsor.reviewed_by = adminId;

        return this.sponsorRepository.save(sponsor);
    }

    // Authentication
    validateAdminToken(token: string): boolean {
        const adminSecret = process.env.ADMIN_SECRET_KEY || 'admin123';
        return token === adminSecret;
    }
}
