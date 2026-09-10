import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { PlanningController } from './planning.controller';
import { PlanningService } from './planning.service';

/**
 * M08 - Ke hoach san xuat ngay/ca (PRD SS3, SRS SS4.8).
 * Import OrderModule vi lockPlan() can kiem tra cap phoi cua tung Order (BRULE-04) -
 * day la vi du module-to-module dependency trong modular monolith (SRS SS2.1).
 */
@Module({
  imports: [OrderModule],
  controllers: [PlanningController],
  providers: [PlanningService],
  exports: [PlanningService],
})
export class PlanningModule {}
