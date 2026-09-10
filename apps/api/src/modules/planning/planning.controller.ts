import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddPlanLineDto } from './dto/add-plan-line.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanningService } from './planning.service';

@Controller('plans')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Post()
  create(@Body() dto: CreatePlanDto) {
    return this.planningService.createPlan(dto);
  }

  @Get()
  findAll() {
    return this.planningService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planningService.findOne(id);
  }

  @Post(':id/lines')
  addLine(@Param('id') id: string, @Body() dto: AddPlanLineDto) {
    return this.planningService.addLine(id, dto);
  }

  @Post(':id/lock')
  lock(@Param('id') id: string) {
    return this.planningService.lockPlan(id);
  }

  @Post(':id/material-demand')
  materialDemand(
    @Param('id') id: string,
    @Body() body: { qtyPerM3ByMaterialByOrder: Record<string, Record<string, number>> },
  ) {
    return this.planningService.materialDemandForPlan(id, body.qtyPerM3ByMaterialByOrder);
  }
}
