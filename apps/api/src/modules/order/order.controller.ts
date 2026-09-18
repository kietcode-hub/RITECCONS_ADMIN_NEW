import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser, toBranchScope } from '../auth/current-user.decorator';
import { RequestUser } from '../auth/jwt.strategy';
import { AssignMixDesignDto } from './dto/assign-mix-design.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: RequestUser) {
    return this.orderService.create(dto, toBranchScope(user));
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.orderService.findAll(toBranchScope(user));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.orderService.findOne(id, toBranchScope(user));
  }

  @Patch(':id/volume')
  updateVolume(@Param('id') id: string, @Body() dto: UpdateVolumeDto, @CurrentUser() user: RequestUser) {
    return this.orderService.updateVolume(id, dto.volumeM3, dto.alreadyDeliveredM3, toBranchScope(user));
  }

  @Patch(':id/mix-design')
  assignMixDesign(@Param('id') id: string, @Body() dto: AssignMixDesignDto, @CurrentUser() user: RequestUser) {
    return this.orderService.assignMixDesign(id, dto.mixDesignId, toBranchScope(user));
  }
}
