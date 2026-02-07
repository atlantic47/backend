import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY, ACCESS_TOKEN_COOKIE, CSRF_TOKEN_COOKIE } from './auth.constants';
import type { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request & { admin?: any }>();
        const authHeader = request.headers.authorization;
        const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
        const cookieToken = request.cookies?.[ACCESS_TOKEN_COOKIE];
        const token = bearerToken || cookieToken;

        if (!token) {
            throw new UnauthorizedException('No access token provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.getAccessSecret(),
            });
            if (payload?.tokenType && payload.tokenType !== 'access') {
                throw new UnauthorizedException('Invalid access token');
            }
            request.admin = payload;

            const method = request.method.toUpperCase();
            if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
                const csrfCookie = request.cookies?.[CSRF_TOKEN_COOKIE];
                const csrfHeader = request.headers['x-csrf-token'];
                const headerValue = Array.isArray(csrfHeader) ? csrfHeader[0] : csrfHeader;
                if (!csrfCookie || !headerValue || csrfCookie !== headerValue) {
                    throw new ForbiddenException('Invalid CSRF token');
                }
            }

            return true;
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new UnauthorizedException('Invalid access token');
        }
    }

    private getAccessSecret() {
        return (
            this.configService.get<string>('jwt.accessSecret') ||
            this.configService.get<string>('jwt.secret') ||
            process.env.JWT_ACCESS_SECRET ||
            process.env.JWT_SECRET ||
            'your-secret-key'
        );
    }
}
