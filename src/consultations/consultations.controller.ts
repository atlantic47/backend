import { Controller, Post, Get, Patch, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { AdminGuard } from '../admin/admin.guard';

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

    // Admin endpoint - Get all consultations
    @Get()
    @UseGuards(AdminGuard)
    async findAll(@Query('status') status?: string) {
        return this.consultationsService.findAll(status);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.consultationsService.findOne(id);
    }

    @Get(':id/recommendations')
    async getRecommendations(@Param('id') id: string) {
        return this.consultationsService.getRecommendations(id);
    }

    // Admin endpoint - Update consultation status
    @Patch(':id/status')
    @UseGuards(AdminGuard)
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string
    ) {
        return this.consultationsService.updateStatus(id, status);
    }
}
