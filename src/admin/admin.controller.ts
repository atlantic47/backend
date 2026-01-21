import { Controller, Get, Post, Param, Body, HttpException, HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('admin')
@UseGuards(AdminGuard)
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
}
