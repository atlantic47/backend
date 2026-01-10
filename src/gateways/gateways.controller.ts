import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ValidationPipe,
    UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { GatewaysService } from './gateways.service';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { FilterGatewayDto } from './dto/filter-gateway.dto';

@Controller('gateways')
export class GatewaysController {
    constructor(private readonly gatewaysService: GatewaysService) { }

    @Post()
    create(@Body(ValidationPipe) createGatewayDto: CreateGatewayDto) {
        return this.gatewaysService.create(createGatewayDto);
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(300) // Cache for 5 minutes
    findAll(@Query(ValidationPipe) filterDto: FilterGatewayDto) {
        return this.gatewaysService.findAll(filterDto);
    }

    @Get(':slug')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(600) // Cache for 10 minutes
    findOne(@Param('slug') slug: string) {
        return this.gatewaysService.findBySlug(slug);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body(ValidationPipe) updateGatewayDto: UpdateGatewayDto,
    ) {
        return this.gatewaysService.update(+id, updateGatewayDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.gatewaysService.remove(+id);
    }
}
