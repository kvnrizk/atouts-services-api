import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client | null = null;
  private readonly bucket: string;
  private readonly cdnUrl: string;
  private readonly endpoint: string;
  private readonly objectAcl?: ObjectCannedACL;
  private readonly isCloudEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get('S3_SECRET_ACCESS_KEY');
    this.bucket = this.configService.get('S3_BUCKET') || '';
    this.cdnUrl = (this.configService.get('S3_CDN_URL') || '').replace(/\/+$/, '');
    this.endpoint = (this.configService.get('S3_ENDPOINT') || '').replace(/\/+$/, '');
    // OVH Object Storage needs "public-read" on each photo; Cloudflare R2 has no ACLs (leave unset)
    this.objectAcl = this.configService.get('S3_OBJECT_ACL') || undefined;

    this.isCloudEnabled = !!(accessKeyId && secretAccessKey && this.bucket);

    if (this.isCloudEnabled) {
      const endpoint = this.endpoint || undefined;
      const region = this.configService.get('S3_REGION') || 'auto';

      this.s3Client = new S3Client({
        region,
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        // Cloudflare R2 requires this
        forcePathStyle: !!endpoint,
      });

      this.logger.log(`Cloud storage enabled (bucket: ${this.bucket})`);
    } else {
      this.logger.log('Cloud storage not configured, using local disk');
    }
  }

  get isCloud(): boolean {
    return this.isCloudEnabled;
  }

  async upload(
    file: Express.Multer.File,
  ): Promise<{ url: string; filename: string }> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;

    if (this.isCloudEnabled && this.s3Client) {
      const key = `uploads/${filename}`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          CacheControl: 'public, max-age=31536000, immutable',
          ACL: this.objectAcl,
        }),
      );

      const url = this.cdnUrl
        ? `${this.cdnUrl}/${key}`
        : this.endpoint
          ? `${this.endpoint}/${this.bucket}/${key}`
          : `https://${this.bucket}.s3.amazonaws.com/${key}`;

      return { url, filename };
    }

    // Local disk: file was already saved by multer diskStorage
    return {
      url: `/uploads/${file.filename || filename}`,
      filename: file.filename || filename,
    };
  }
}
