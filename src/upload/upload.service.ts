import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ipfsApi from 'ipfs-api'

@Injectable()
export class UploadService {
  private ipfs;
  private readonly basePath;

  constructor(private configService: ConfigService) {
    this.ipfs = ipfsApi({
      host: this.configService.get('upload.host'),
      port: this.configService.get('upload.ipfs_port'),
      protocol: this.configService.get('upload.protocol'),
    });
    this.basePath = this.configService.get('upload.upload_path');
  }

  async upload(file: Express.Multer.File) {
    const fileBuffer = file.buffer;
    const fileHash = await this.ipfs.add(fileBuffer);
    return `${this.basePath}${fileHash[0].hash}`;
  }
}
