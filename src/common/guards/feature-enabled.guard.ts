import { CanActivate, Injectable, NotFoundException } from '@nestjs/common';

/**
 * Hides the price simulator API while the feature is switched off
 * (mirror of the frontend lib/features.ts). Enable with FEATURE_SIMULATOR=true.
 * Answers 404, as if the endpoint did not exist, so no personal data can be sent to it.
 */
@Injectable()
export class SimulatorEnabledGuard implements CanActivate {
  canActivate(): boolean {
    if (process.env.FEATURE_SIMULATOR !== 'true') throw new NotFoundException();
    return true;
  }
}
