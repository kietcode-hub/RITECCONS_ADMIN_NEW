import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/volume')
  updateVolume(
    @Param('id') id: string,
    @Body() body: { volumeM3: number; alreadyDeliveredM3: number },
  ) {
    return this.orderService.updateVolume(id, body.volumeM3, body.alreadyDeliveredM3);
  }

  @Patch(':id/mix-design')
  assignMixDesign(@Param('id') id: string, @Body() body: { mixDesignId: string }) {
    return this.orderService.assignMixDesign(id, body.mixDesignId);
  }
}
