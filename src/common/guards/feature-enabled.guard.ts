import { CanActivate, Injectable, NotFoundException, Type, mixin } from '@nestjs/common';

/**
 * Hides a whole controller while its feature is switched off (mirror of the frontend
 * lib/features.ts). The feature is on only when the env variable is exactly "true".
 * Answers 404, as if the endpoint did not exist, so no personal data can be sent to it.
 */
export function FeatureEnabledGuard(envVar: string): Type<CanActivate> {
  @Injectable()
  class Guard implements CanActivate {
    canActivate(): boolean {
      if (process.env[envVar] !== 'true') throw new NotFoundException();
      return true;
    }
  }
  return mixin(Guard);
}

/** Price simulator — disabled 2026-09-25 (owner's decision). */
export const SimulatorEnabledGuard = FeatureEnabledGuard('FEATURE_SIMULATOR');
/** Online payments (Stripe) — disabled 2026-09-25: the company does not take payments through the site. */
export const PaymentsEnabledGuard = FeatureEnabledGuard('FEATURE_PAYMENTS');
