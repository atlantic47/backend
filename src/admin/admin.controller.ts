import { Controller, Get, Post, Param, Body, HttpException, HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';
import { IS_PUBLIC_KEY } from './auth.constants';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('admin')
@UseGuards(AdminGuard) // Protect ALL admin endpoints
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // Gateway endpoints
    @Get('gateways/pending')
    async getPendingGateways() {
        return this.adminService.getPendingGateways();
    }

    @Post('gateways/:id/approve')
    async approveGateway(@Param('id') id: string, @Body() body: { adminId: string }) {
        try {
            const gateway = await this.adminService.approveGateway(+id, body.adminId || 'admin');
            return { success: true, gateway };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('gateways/:id/reject')
    async rejectGateway(@Param('id') id: string, @Body() body: { adminId: string }) {
        try {
            const gateway = await this.adminService.rejectGateway(+id, body.adminId || 'admin');
            return { success: true, gateway };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Sponsor endpoints
    @Get('sponsors/pending')
    async getPendingSponsors() {
        return this.adminService.getPendingSponsors();
    }

    @Post('sponsors/:id/approve')
    async approveSponsor(@Param('id') id: string, @Body() body: { adminId: string }) {
        try {
            const sponsor = await this.adminService.approveSponsor(+id, body.adminId || 'admin');
            return { success: true, sponsor };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('sponsors/:id/reject')
    async rejectSponsor(@Param('id') id: string, @Body() body: { adminId: string }) {
        try {
            const sponsor = await this.adminService.rejectSponsor(+id, body.adminId || 'admin');
            return { success: true, sponsor };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Utility endpoint to fix existing approved gateways
    @Post('gateways/fix-status-slot')
    async fixApprovedGatewaysStatusSlot() {
        try {
            const result = await this.adminService.fixApprovedGatewaysStatusSlot();
            return { success: true, ...result };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
