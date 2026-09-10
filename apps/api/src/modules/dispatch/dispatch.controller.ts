import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AssignTripDto } from './dto/assign-trip.dto';
import { RecordMilestoneDto } from './dto/record-milestone.dto';
import { DispatchService } from './dispatch.service';

@Controller('dispatch/trips')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post()
  assignVehicle(@Body() dto: AssignTripDto) {
    return this.dispatchService.assignVehicle(dto);
  }

  @Get()
  findAll() {
    return this.dispatchService.findAll();
  }

  @Get('warnings')
  getWarnings(@Query('now') now?: string) {
    return this.dispatchService.getMixingWarnings(now ? new Date(now) : new Date());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dispatchService.findOne(id);
  }

  @Post(':id/milestone')
  recordMilestone(@Param('id') id: string, @Body() dto: RecordMilestoneDto) {
    return this.dispatchService.recordMilestone(id, dto);
  }

  @Get(':id/cycle-time')
  getCycleTime(@Param('id') id: string) {
    return { cycleTimeMinutes: this.dispatchService.getCycleTimeMinutes(id) };
  }
}
