import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
    namespace: '/analytics',
})
@Injectable()
export class AnalyticsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private updateInterval: NodeJS.Timeout;

    constructor(private analyticsService: AnalyticsService) { }

    afterInit() {
        console.log('Analytics WebSocket Gateway initialized');

        // Broadcast live visitor updates every 3 seconds
        this.updateInterval = setInterval(async () => {
            const liveVisitors = await this.analyticsService.getLiveVisitors();
            this.server.emit('visitors_update', liveVisitors);
        }, 3000);
    }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);

        // Send initial data immediately
        this.sendInitialData(client);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    private async sendInitialData(client: Socket) {
        const [liveVisitors, dashboardStats] = await Promise.all([
            this.analyticsService.getLiveVisitors(),
            this.analyticsService.getDashboardStats(),
        ]);

        client.emit('initial_data', {
            liveVisitors,
            dashboardStats,
        });
    }

    @SubscribeMessage('request_update')
    async handleRequestUpdate(client: Socket) {
        await this.sendInitialData(client);
    }

    /**
     * Broadcast new visitor event
     */
    async broadcastNewVisitor(countryCode: string, countryName: string) {
        const emoji = this.getCountryEmoji(countryCode);
        this.server.emit('new_visitor', {
            countryCode,
            countryName,
            emoji,
            timestamp: new Date(),
        });
    }

    private getCountryEmoji(countryCode: string): string {
        if (countryCode === 'XX') return '🌍';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map((char) => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    onModuleDestroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}
