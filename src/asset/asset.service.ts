import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { endOfMonth } from 'date-fns';
import { AssetData, AssetDocument } from './asset.schema';
import {
  AssetDto,
  BanAssetDto,
  BuyAssetDto,
  CreateAssetDto,
  QueryDataDto,
  QueryDto,
  SellAssetDto,
} from './dto/asset.dto';

import { DATE, STATUS } from '../components/enum';
import { escapeRegExp } from 'lodash';
import { BaseService } from '../common/base.service';
import { FilterQuery, Types } from 'mongoose';

@Injectable()
export class AssetService extends BaseService {
  constructor(
    @InjectModel(AssetData.name)
    private assetModel: SoftDeleteModel<AssetDocument>
  ) {
    super();
  }

  count(query: FilterQuery<AssetData>) {
    return this.assetModel.count(query).exec();
  }

  async find(
    query: QueryDto,
    sortby: string
  ): Promise<{ data: AssetData[]; total: number }> {
    const queryData: QueryDataDto = {};
    if (query.category_id) {
      queryData.category_id = query.category_id;
    }
    if (query.collection_id) {
      queryData.collection_id = query.collection_id;
    }
    if (query.status) {
      queryData.status = STATUS.ONSALE;
    }
    if (query.isDeleted) {
      queryData.isDeleted = true;
    }
    queryData.name = { $regex: escapeRegExp(query.name), $options: 'i' };

    const total = await this.count(queryData);
    const data = await this.assetModel
      .find(queryData)
      .sort(sortby)
      .skip(this.getSkipNumber(query.page, query.limit))
      .limit(query.limit)
      .exec();

    return { data, total };
  }

  findById(id: string) {
    return this.assetModel.findById(id).exec();
  }

  listDashboard(query: DATE) {
    const curr = new Date();
    let groupDate = [];
    if (query == DATE.WEEK) {
      const currDate = curr.getDate() - 8;
      curr.setHours(0, 0, 0, 0);
      curr.setDate(currDate);
      const firstDate = curr;
      const lastDate = new Date();
      lastDate.setHours(23, 59, 59);
      groupDate = [
        this.matchDate(firstDate, lastDate),
        { $sort: { createdAt: -1 } },
      ];
    } else if (query == DATE.MONTH) {
      curr.setHours(0, 0, 0, 0);
      curr.setDate(1);
      const Date = endOfMonth(curr);
      groupDate = [this.matchDate(curr, Date), { $sort: { createdAt: 1 } }];
    } else if (query == DATE.YEAR) {
      const curr = new Date();
      const currMonth = new Date(curr.getFullYear(), 0, 1);
      const current = new Date();
      groupDate = [
        this.matchDate(currMonth, current),
        { $sort: { createdAt: 1 } },
      ];
    } else {
      groupDate = [{ $sort: { createdAt: 1, _id: 1 } }];
    }
    return this.assetModel.aggregate(groupDate);
  }

  create(dto: CreateAssetDto): Promise<AssetData> {
    console.log(dto)
    return this.assetModel.create({
      ...dto,
      user_id: new Types.ObjectId(dto.user_id),
    });
  }

  update(id: string, dto: AssetDto): Promise<AssetData> {
    return this.assetModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  updateSell(id: string, dto: SellAssetDto): Promise<AssetData> {
    return this.assetModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  updateBuy(id: string, dto: BuyAssetDto): Promise<AssetData> {
    return this.assetModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  findByUser(user_id: string) {
    return this.assetModel.find({ _id: user_id }).exec();
  }

  softDeleted(id: string) {
    const filter = { _id: id };
    return this.assetModel.softDelete(filter);
  }

  findDeletedByName(name: string) {
    return this.assetModel.find(
      {
        isDeleted: true,
      },
      {
        name: { $regex: escapeRegExp(name), $options: 'i' },
      }
    );
  }

  restore(id: string) {
    const filter = { _id: id };
    return this.assetModel.restore(filter);
  }

  findByName(name: string) {
    return this.assetModel.find({
      name: { $regex: escapeRegExp(name), $options: 'i' },
    });
  }

  updateStatus(id: string, status: BanAssetDto) {
    return this.assetModel.findByIdAndUpdate(id, status, { new: true }).exec();
  }
}
