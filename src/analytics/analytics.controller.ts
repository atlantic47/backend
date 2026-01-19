import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsGateway } from './analytics.gateway';
import type { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
    constructor(
        private analyticsService: AnalyticsService,
        private analyticsGateway: AnalyticsGateway,
    ) { }

    /**
     * Public endpoint to track visitor
     */
    @Post('track')
    async trackVisitor(@Body() body: any, @Req() req: Request) {
        const sessionId = body.sessionId || req.headers['x-session-id'] as string;
        const ip = this.getClientIp(req);
        const userAgent = req.headers['user-agent'];
        const referrer = req.headers['referer'];

        if (!sessionId) {
            return { error: 'Session ID required' };
        }

        const visitor = await this.analyticsService.trackVisitor(
            sessionId,
            ip,
            userAgent,
            referrer,
        );

        // Broadcast new visitor event via WebSocket
        await this.analyticsGateway.broadcastNewVisitor(
            visitor.country_code,
            visitor.country_name,
        );

        return { success: true };
    }

    /**
     * Get live visitors (public for now, add auth later)
     */
    @Get('live')
    async getLiveVisitors() {
        return this.analyticsService.getLiveVisitors();
    }

    /**
     * Get dashboard stats (public for now, add auth later)
     */
    @Get('dashboard')
    async getDashboardStats() {
        return this.analyticsService.getDashboardStats();
    }

    /**
     * Extract client IP from request
     */
    private getClientIp(req: Request): string {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            return (forwarded as string).split(',')[0].trim();
        }
        return req.socket.remoteAddress || '127.0.0.1';
    }
}
