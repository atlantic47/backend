import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './admin.controller';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No admin token provided');
        }

        const token = authHeader.substring(7);
        const adminSecret = process.env.ADMIN_SECRET_KEY || 'admin123';

        if (token !== adminSecret) {
            throw new UnauthorizedException('Invalid admin token');
        }

        return true;
    }
}
