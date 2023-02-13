import { PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private logger = new Logger(UploadService.name);
  private region: string;
  private s3: S3Client

  constructor(private configService: ConfigService) {
    this.region = 'ap-northeast-1';
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: 'AKIASDSQO2SN55OFTNV5',
        secretAccessKey: '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'
      }
    })
  }

  async upload(file: Express.Multer.File) {
    const key = `${file.fieldname}${Date.now()}`;
    const bucket = 'nft-marketplace-mybucket'
    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );
      if (response.$metadata.httpStatusCode === 200) {
        return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
      }
      throw new Error('Image not saved in s3!');
    } catch (err) {
      this.logger.error('Cannot save file to s3,', err);
      throw err;
    }
  }

}
