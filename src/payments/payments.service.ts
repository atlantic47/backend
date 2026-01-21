import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsor } from '../database/entities/sponsor.entity';
import { PaymentGateway } from '../database/entities/payment-gateway.entity';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
    private readonly paystackSecretKey: string;
    private readonly paystackBaseUrl = 'https://api.paystack.co';

    constructor(
        @InjectRepository(Sponsor)
        private sponsorRepository: Repository<Sponsor>,
        @InjectRepository(PaymentGateway)
        private gatewayRepository: Repository<PaymentGateway>,
    ) {
        this.paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || '';
        if (!this.paystackSecretKey) {
            console.warn('PAYSTACK_SECRET_KEY not set in environment variables');
        }
    }

    async initializePayment(email: string, amount: number, metadata: any) {
        if (!this.paystackSecretKey) {
            throw new BadRequestException('Paystack secret key not configured');
        }

        const payload = {
            email,
            amount: amount * 100, // Convert to smallest currency unit
            metadata,
        };

        console.log('Initializing Paystack payment with payload:', JSON.stringify(payload, null, 2));

        try {
            const response = await fetch(`${this.paystackBaseUrl}/transaction/initialize`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.paystackSecretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log('Paystack response:', JSON.stringify(data, null, 2));

            if (!response.ok || !data.status) {
                console.error('Paystack initialization failed:', data);
                throw new BadRequestException(data.message || 'Failed to initialize payment');
            }

            return data.data;
        } catch (error) {
            console.error('Payment initialization error:', error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Payment initialization failed');
        }
    }

    async verifyPayment(reference: string) {
        try {
            const response = await fetch(
                `${this.paystackBaseUrl}/transaction/verify/${reference}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.paystackSecretKey}`,
                    },
                },
            );

            const data = await response.json();

            if (!data.status || data.data.status !== 'success') {
                throw new BadRequestException('Payment verification failed');
            }

            return data.data;
        } catch (error) {
            throw new BadRequestException('Payment verification failed');
        }
    }

    async handlePaymentSuccess(reference: string) {
        const paymentData = await this.verifyPayment(reference);
        const metadata = paymentData.metadata;

        // Find the sponsor by payment reference
        const sponsor = await this.sponsorRepository.findOne({
            where: { payment_reference: reference },
            relations: ['gateway'],
        });

        if (!sponsor) {
            throw new NotFoundException('Sponsor not found');
        }

        // Auto-approve the sponsor
        sponsor.approval_status = 'approved';
        sponsor.is_active = true;
        sponsor.payment_status = 'completed';
        sponsor.payment_amount = paymentData.amount / 100; // Convert from kobo
        sponsor.paid_at = new Date();

        await this.sponsorRepository.save(sponsor);

        // Also approve the gateway if it's pending
        if (sponsor.gateway && sponsor.gateway.approval_status === 'pending') {
            sponsor.gateway.approval_status = 'approved';
            sponsor.gateway.reviewed_at = new Date();
            sponsor.gateway.reviewed_by = 'system';
            await this.gatewayRepository.save(sponsor.gateway);
        }

        return {
            success: true,
            sponsor,
            message: 'Payment successful and sponsor approved',
        };
    }

    verifyWebhookSignature(payload: string, signature: string): boolean {
        const hash = crypto
            .createHmac('sha512', this.paystackSecretKey)
            .update(payload)
            .digest('hex');
        return hash === signature;
    }

    async handleWebhook(event: any) {
        if (event.event === 'charge.success') {
            const reference = event.data.reference;
            await this.handlePaymentSuccess(reference);
        }
    }
}
