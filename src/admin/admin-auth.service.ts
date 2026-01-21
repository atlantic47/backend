import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { StringValue } from 'ms';
import { AdminUser } from '../database/entities/admin-user.entity';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
}

@Injectable()
export class AdminAuthService {
    constructor(
        @InjectRepository(AdminUser)
        private adminUserRepository: Repository<AdminUser>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async signup(dto: AdminSignupDto) {
        const existing = await this.adminUserRepository.findOne({
            where: [
                { email: dto.email },
                { username: dto.username },
            ],
        });

        if (existing) {
            throw new ConflictException('Email or username already in use');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = this.adminUserRepository.create({
            full_name: dto.fullName,
            username: dto.username,
            email: dto.email,
            password_hash: passwordHash,
            role: 'admin',
            is_active: true,
            last_login_at: new Date(),
        });

        const saved = await this.adminUserRepository.save(user);
        const tokens = await this.issueTokens(saved);
        return {
            user: this.buildUserResponse(saved),
            ...tokens,
        };
    }

    async login(dto: AdminLoginDto) {
        const user = await this.adminUserRepository.findOne({
            where: [
                { username: dto.username },
                { email: dto.username },
            ],
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.is_active) {
            throw new UnauthorizedException('Account is inactive');
        }

        const match = await bcrypt.compare(dto.password, user.password_hash);
        if (!match) {
            throw new UnauthorizedException('Invalid credentials');
        }

        user.last_login_at = new Date();
        await this.adminUserRepository.save(user);

        const tokens = await this.issueTokens(user);
        return {
            user: this.buildUserResponse(user),
            ...tokens,
        };
    }

    async refresh(refreshToken: string) {
        const payload = await this.verifyRefreshToken(refreshToken);
        const user = await this.adminUserRepository.findOne({ where: { id: payload.sub } });
        if (!user || !user.refresh_token_hash) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (!user.is_active) {
            throw new UnauthorizedException('Account is inactive');
        }

        const match = await bcrypt.compare(refreshToken, user.refresh_token_hash);
        if (!match) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (user.refresh_token_expires_at && user.refresh_token_expires_at < new Date()) {
            throw new UnauthorizedException('Refresh token expired');
        }

        const tokens = await this.issueTokens(user);
        return {
            user: this.buildUserResponse(user),
            ...tokens,
        };
    }

    async logout(refreshToken?: string) {
        if (!refreshToken) {
            return;
        }
        try {
            const payload = await this.verifyRefreshToken(refreshToken);
            const user = await this.adminUserRepository.findOne({ where: { id: payload.sub } });
            if (!user) {
                return;
            }
            user.refresh_token_hash = null;
            user.refresh_token_expires_at = null;
            await this.adminUserRepository.save(user);
        } catch (error) {
            return;
        }
    }

    private async issueTokens(user: AdminUser): Promise<AuthTokens> {
        const accessToken = this.jwtService.sign(
            {
                sub: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                tokenType: 'access',
            },
            {
                secret: this.getAccessSecret(),
                expiresIn: this.getAccessExpiresIn(),
            },
        );

        const refreshToken = this.jwtService.sign(
            {
                sub: user.id,
                username: user.username,
                role: user.role,
                tokenType: 'refresh',
            },
            {
                secret: this.getRefreshSecret(),
                expiresIn: this.getRefreshExpiresIn(),
            },
        );

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        const refreshTokenExpiresAt = this.getTokenExpiresAt(refreshToken);
        user.refresh_token_hash = refreshTokenHash;
        user.refresh_token_expires_at = refreshTokenExpiresAt;
        await this.adminUserRepository.save(user);

        return {
            accessToken,
            refreshToken,
            accessTokenExpiresAt: this.getTokenExpiresAt(accessToken),
            refreshTokenExpiresAt,
        };
    }

    private async verifyRefreshToken(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.getRefreshSecret(),
            });
            if (payload?.tokenType !== 'refresh') {
                throw new UnauthorizedException('Invalid refresh token');
            }
            return payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private buildUserResponse(user: AdminUser) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
        };
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

    private getRefreshSecret() {
        return (
            this.configService.get<string>('jwt.refreshSecret') ||
            this.configService.get<string>('jwt.secret') ||
            process.env.JWT_REFRESH_SECRET ||
            process.env.JWT_SECRET ||
            'your-secret-key'
        );
    }

    private getAccessExpiresIn(): StringValue | number {
        return (
            (this.configService.get<StringValue>('jwt.accessExpiresIn') ||
                this.configService.get<StringValue>('jwt.expiresIn') ||
                (process.env.JWT_ACCESS_EXPIRES_IN as StringValue | undefined) ||
                (process.env.JWT_EXPIRES_IN as StringValue | undefined) ||
                '15m') as StringValue
        );
    }

    private getRefreshExpiresIn(): StringValue | number {
        return (
            (this.configService.get<StringValue>('jwt.refreshExpiresIn') ||
                (process.env.JWT_REFRESH_EXPIRES_IN as StringValue | undefined) ||
                '7d') as StringValue
        );
    }

    private getTokenExpiresAt(token: string) {
        const decoded = this.jwtService.decode(token);
        if (!decoded || typeof decoded === 'string') {
            return new Date();
        }
        const exp = decoded.exp;
        if (!exp) {
            return new Date();
        }
        return new Date(exp * 1000);
    }
}
