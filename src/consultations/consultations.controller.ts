import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@Controller('consultations')
export class ConsultationsController {
    constructor(private readonly consultationsService: ConsultationsService) { }

    @Post()
    async create(@Body() createConsultationDto: CreateConsultationDto) {
        const consultation = await this.consultationsService.create(createConsultationDto);
        return {
            success: true,
            message: 'Consultation submitted successfully! We will review your requirements and get back to you soon.',
            consultation: {
                id: consultation.id,
                name: consultation.name,
                email: consultation.email,
                created_at: consultation.created_at,
            },
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.consultationsService.findOne(id);
    }

    @Get(':id/recommendations')
    async getRecommendations(@Param('id') id: string) {
        return this.consultationsService.getRecommendations(id);
    }
}
