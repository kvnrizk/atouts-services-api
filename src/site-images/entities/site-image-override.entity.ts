import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

/**
 * Replacement for one of the photos built into the site (keys of lib/site-images.ts in the
 * frontend, e.g. "maison", "peinture"). No row = the default photo is used.
 */
@Entity('site_image_overrides')
export class SiteImageOverride {
  @PrimaryColumn({ length: 60 })
  key: string;

  @Column({ length: 500 })
  url: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
