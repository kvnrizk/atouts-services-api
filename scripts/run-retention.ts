import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { RetentionService } from '../src/retention/retention.service';

/**
 * Runs the RGPD retention job on demand (it also runs every night at 03:00).
 * Usage: npm run retention            -> deletes expired data
 *        npm run retention -- --dry-run -> only counts what would be deleted
 */
async function bootstrap() {
  const dryRun = process.argv.includes('--dry-run');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
  try {
    const report = await app.get(RetentionService).run(dryRun);
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await app.close();
  }
}

void bootstrap();
