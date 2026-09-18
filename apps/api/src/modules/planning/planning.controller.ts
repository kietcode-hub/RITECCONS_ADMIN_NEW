import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser, toBranchScope } from '../auth/current-user.decorator';
import { RequestUser } from '../auth/jwt.strategy';
import { AddPlanLineDto } from './dto/add-plan-line.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { MaterialDemandDto } from './dto/material-demand.dto';
import { PlanningService } from './planning.service';

@Controller('plans')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Post()
  create(@Body() dto: CreatePlanDto, @CurrentUser() user: RequestUser) {
    return this.planningService.createPlan(dto, toBranchScope(user));
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.planningService.findAll(toBranchScope(user));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.planningService.findOne(id, toBranchScope(user));
  }

  @Post(':id/lines')
  addLine(@Param('id') id: string, @Body() dto: AddPlanLineDto, @CurrentUser() user: RequestUser) {
    return this.planningService.addLine(id, dto, toBranchScope(user));
  }

  @Post(':id/lock')
  lock(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.planningService.lockPlan(id, toBranchScope(user));
  }

  @Post(':id/material-demand')
  materialDemand(@Param('id') id: string, @Body() dto: MaterialDemandDto, @CurrentUser() user: RequestUser) {
    return this.planningService.materialDemandForPlan(id, dto.qtyPerM3ByMaterialByOrder, toBranchScope(user));
  }
}
