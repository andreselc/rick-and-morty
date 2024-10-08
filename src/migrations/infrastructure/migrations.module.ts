import { Module } from '@nestjs/common';
import { MigrationService } from './migrations.service';
@Module({
  providers: [MigrationService],
  exports: [MigrationService],
})
export class PrismaModule{}