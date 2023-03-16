import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryDto, StatusDto, UpdateUserDto, UserDto } from '../dto/user.dto';
import { UserData, UserDocument } from '../schema/user.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import Web3 from 'web3';
import { endOfMonth } from 'date-fns';
import { escapeRegExp } from 'lodash';
import { BaseService } from '../../common/base.service';
import { DATE } from '../../components/enum';

@Injectable()
export class UserService extends BaseService {
  private readonly web3;

  constructor(
    @InjectModel(UserData.name) private userModel: Model<UserDocument>
  ) {
    super();
    this.web3 = new Web3();
  }

  findByName(username: string): Promise<UserData> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async findAddressOrCreate(address: string) {
    const findAddress = await this.userModel.findOne({ address });
    if (!findAddress) {
      return this.userModel.create({
        address: address,
        username: 'unnamed',
        profile_url: 'https://nft-marketplace-mybucket.s3.ap-northeast-1.amazonaws.com/file1676364349075',
        banner_url: 'https://nft-marketplace-mybucket.s3.ap-northeast-1.amazonaws.com/file1676365627703',
        status_ban: false,
      });
    }
    return findAddress;
  }

  async findByAddress(address: string) {
    console.log(address)
    return await this.userModel.find({ address});
  }

  findById(id: string) {
    console.log(id)
    return this.userModel.findById(id);
  }

  findByIdAndUpdate(id: string, data: UserDto) {
    return this.userModel.findByIdAndUpdate(id, data);
  }

  updateEmail(id: string, email: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { email_address: email },
      { new: true }
    );
  }

  verifyEmail(id: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { $set: { isVerified: true } },
      { new: true }
    );
  }

  async findAll(){
    return this.userModel.find()
  }

  async listDashboard(query: DATE) {
    let groupDate = [];
    const currentDate = new Date();
    if (query == DATE.WEEK) {
      const currDate = currentDate.getDate() - 8;
      currentDate.setHours(0, 0, 0, 0);
      currentDate.setDate(currDate);
      const firstDate = currentDate;
      groupDate = [this.matchDate(firstDate, new Date()), this.groupAndCount()];
    } else if (query == DATE.MONTH) {
      currentDate.setHours(0, 0, 0, 0);
      currentDate.setDate(1);
      const Date = endOfMonth(currentDate);
      groupDate = [this.matchDate(currentDate, Date), this.groupAndCount()];
    } else if (query == DATE.YEAR) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      currentDate.setMonth(0);
      const firstMonth = currentDate;
      const currMonth = new Date();
      groupDate = [this.matchDate(firstMonth, currMonth), this.groupAndCount()];
    } else {
      groupDate = [{ $sort: { createdAt: 1, _id: 1 } }, this.groupAndCount()];
    }
    return this.userModel.aggregate(groupDate);
  }

  async find(
    query: QueryDto,
    sortby?: string
  ): Promise<{ data: UserData[]; total: number }> {
    const queryData = {
      username: { $regex: escapeRegExp(query.username), $options: 'i' },
    };
    const total = await this.count(queryData);
    const data = await this.userModel
      .find(queryData)
      .sort(sortby)
      .skip(this.getSkipNumber(query.page, query.limit))
      .limit(query.limit)
      .exec();
    return { data, total };
  }

  update(id: string, userDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, userDto, { new: true });
  }
  updateStatus(id: string, dto: StatusDto) {
    return this.userModel.findByIdAndUpdate(id, dto, { new: true });
  }

  delete(id: string) {
    return this.userModel.findByIdAndRemove(id).exec();
  }

  count(query: FilterQuery<UserData>) {
    return this.userModel.count(query).exec();
  }
}
