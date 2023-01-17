import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminData, AdminDocument } from './admin.schema';
import { Model } from 'mongoose';
import { AdminCommandDto } from './admin.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AdminData.name)
    private adminModel: Model<AdminDocument>
  ) {}

  async create(admin: AdminCommandDto) {
    const salt = await bcrypt.genSalt();
    const adminPassword = bcrypt.hashSync(admin.password, salt)
    return this.adminModel.create({
      username: admin.username,
      password: adminPassword,
    });
  }

  findAdmin(username: string) {
    return this.adminModel.findOne({ username });
  }

  findById(id: string) {
    return this.adminModel.findById(id).lean();
  }

  findAll() {
    return this.adminModel.find().exec();
  }
}
