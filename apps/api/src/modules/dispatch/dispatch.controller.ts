import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IsISO8601, IsOptional } from 'class-validator';
import { CurrentUser, toBranchScope } from '../auth/current-user.decorator';
import { RequestUser } from '../auth/jwt.strategy';
import { AssignTripDto } from './dto/assign-trip.dto';
import { RecordMilestoneDto } from './dto/record-milestone.dto';
import { DispatchService } from './dispatch.service';

class WarningsQueryDto {
  @IsOptional() @IsISO8601()
  now?: string;
}

@Controller('dispatch/trips')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post()
  assignVehicle(@Body() dto: AssignTripDto, @CurrentUser() user: RequestUser) {
    return this.dispatchService.assignVehicle(dto, toBranchScope(user));
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.dispatchService.findAll(toBranchScope(user));
  }

  @Get('warnings')
  getWarnings(@Query() query: WarningsQueryDto, @CurrentUser() user: RequestUser) {
    return this.dispatchService.getMixingWarnings(query.now ? new Date(query.now) : new Date(), toBranchScope(user));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.dispatchService.findOne(id, toBranchScope(user));
  }

  @Post(':id/milestone')
  recordMilestone(@Param('id') id: string, @Body() dto: RecordMilestoneDto, @CurrentUser() user: RequestUser) {
    return this.dispatchService.recordMilestone(id, dto, toBranchScope(user));
  }

  @Get(':id/cycle-time')
  getCycleTime(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return { cycleTimeMinutes: this.dispatchService.getCycleTimeMinutes(id, toBranchScope(user)) };
  }
}
