import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './modules/admin/admin.module';
import { ArModule } from './modules/ar/ar.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { ContractModule } from './modules/contract/contract.module';
import { CrmModule } from './modules/crm/crm.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { FleetModule } from './modules/fleet/fleet.module';
import { HealthModule } from './modules/health/health.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { MaterialModule } from './modules/material/material.module';
import { MixdesignModule } from './modules/mixdesign/mixdesign.module';
import { OrderModule } from './modules/order/order.module';
import { PlanningModule } from './modules/planning/planning.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { QualityModule } from './modules/quality/quality.module';
import { ReportingModule } from './modules/reporting/reporting.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    // M01..M14, M16 (SRS SS4) - M15 (Mobile App) la client rieng, khong nam trong API.
    AdminModule,
    CrmModule,
    PricingModule,
    ContractModule,
    OrderModule,
    MixdesignModule,
    QualityModule,
    PlanningModule,
    MaterialModule,
    DispatchModule,
    FleetModule,
    DeliveryModule,
    ArModule,
    ReportingModule,
    IntegrationModule,
  ],
  providers: [
    // Guard toan cuc: moi route yeu cau JWT hop le, tru khi danh dau @Public()
    // (xem modules/auth/public.decorator.ts). Vá Finding 1 cua security-review.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
