import { Controller, Post, Body, Headers, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('initialize')
    async initializePayment(
        @Body() body: { email: string; amount: number; metadata: any },
    ) {
        return this.paymentsService.initializePayment(
            body.email,
            body.amount,
            body.metadata,
        );
    }

    @Post('verify')
    async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
        return this.paymentsService.handlePaymentSuccess(verifyPaymentDto.reference);
    }

    @Post('webhook')
    async handleWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('x-paystack-signature') signature: string,
    ) {
        if (!req.rawBody) {
            return { status: 'error', message: 'No request body' };
        }

        const payload = req.rawBody.toString('utf8');

        // Verify webhook signature
        const isValid = this.paymentsService.verifyWebhookSignature(payload, signature);

        if (!isValid) {
            return { status: 'error', message: 'Invalid signature' };
        }

        const event = JSON.parse(payload);
        await this.paymentsService.handleWebhook(event);

        return { status: 'success' };
    }
}
