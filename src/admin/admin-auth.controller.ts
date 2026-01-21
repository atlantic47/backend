import { Body, Controller, Post, Get, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { AdminAuthService } from './admin-auth.service';
import { Public } from './admin.controller';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ACCESS_TOKEN_COOKIE, CSRF_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './auth.constants';
import { CsrfGuard } from './csrf.guard';
import { AdminGuard } from './admin.guard';

@Controller('admin/auth')
export class AdminAuthController {
    constructor(private readonly adminAuthService: AdminAuthService) { }

    @Post('signup')
    @Public()
    async signup(@Body() dto: AdminSignupDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.adminAuthService.signup(dto);
        const csrfToken = this.issueCsrfToken(res, result.refreshTokenExpiresAt);
        this.setAuthCookies(res, result.accessToken, result.refreshToken, result.accessTokenExpiresAt, result.refreshTokenExpiresAt);
        return { success: true, user: result.user, csrfToken };
    }

    @Post('login')
    @Public()
    async login(@Body() dto: AdminLoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.adminAuthService.login(dto);
        const csrfToken = this.issueCsrfToken(res, result.refreshTokenExpiresAt);
        this.setAuthCookies(res, result.accessToken, result.refreshToken, result.accessTokenExpiresAt, result.refreshTokenExpiresAt);
        return { success: true, user: result.user, csrfToken };
    }

    @Post('refresh')
    @Public()
    @UseGuards(CsrfGuard)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
        if (!refreshToken) {
            throw new UnauthorizedException('Missing refresh token');
        }
        const result = await this.adminAuthService.refresh(refreshToken);
        const csrfToken = this.issueCsrfToken(res, result.refreshTokenExpiresAt);
        this.setAuthCookies(res, result.accessToken, result.refreshToken, result.accessTokenExpiresAt, result.refreshTokenExpiresAt);
        return { success: true, user: result.user, csrfToken };
    }

    @Post('logout')
    @Public()
    @UseGuards(CsrfGuard)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
        await this.adminAuthService.logout(refreshToken);
        this.clearAuthCookies(res);
        return { success: true };
    }

    @Get('me')
    @UseGuards(AdminGuard)
    me(@Req() req: Request & { admin?: any }) {
        return { success: true, user: req.admin };
    }

    private issueCsrfToken(res: Response, expiresAt?: Date) {
        const csrfToken = randomBytes(24).toString('hex');
        res.cookie(CSRF_TOKEN_COOKIE, csrfToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
            path: '/',
        });
        return csrfToken;
    }

    private setAuthCookies(
        res: Response,
        accessToken: string,
        refreshToken: string,
        accessTokenExpiresAt: Date,
        refreshTokenExpiresAt: Date,
    ) {
        const secure = process.env.NODE_ENV === 'production';
        res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            expires: accessTokenExpiresAt,
            path: '/',
        });
        res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            expires: refreshTokenExpiresAt,
            path: '/',
        });
    }

    private clearAuthCookies(res: Response) {
        res.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
        res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
        res.clearCookie(CSRF_TOKEN_COOKIE, { path: '/' });
    }
}
