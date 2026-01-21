import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { CSRF_TOKEN_COOKIE } from './auth.constants';

@Injectable()
export class CsrfGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const cookieToken = request.cookies?.[CSRF_TOKEN_COOKIE];
        const headerToken = request.headers['x-csrf-token'];
        const headerValue = Array.isArray(headerToken) ? headerToken[0] : headerToken;

        if (!cookieToken || !headerValue || cookieToken !== headerValue) {
            throw new ForbiddenException('Invalid CSRF token');
        }

        return true;
    }
}
