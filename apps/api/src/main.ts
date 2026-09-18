import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { BranchScopeExceptionFilter } from './common/filters/branch-scope-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Vá Finding 2 cua security-review: tu choi request sai kieu/thua truong
  // truoc khi cham toi business-rule (tranh bug so sanh NaN).
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new BranchScopeExceptionFilter());
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`RMC-MS API dang chay tai http://localhost:${port}`);
}
bootstrap();
