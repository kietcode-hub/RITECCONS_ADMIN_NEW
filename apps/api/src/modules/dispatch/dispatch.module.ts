import { Module } from '@nestjs/common';
import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';

/**
 * M10 - Bang dieu phoi & Quan ly chuyen (PRD SS3, SRS SS4.10).
 */
@Module({
  controllers: [DispatchController],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}
