import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { endOfMonth } from 'date-fns';
import { FilterQuery, Model } from 'mongoose';
import { DATE } from '../../components/enum';
import { CollectionDto, QueryDataDto, QueryDto } from '../dto/collection.dto';
import {
  CollectionData,
  CollectionDocument,
} from '../schema/collection.schema';
import { escapeRegExp } from 'lodash';
import { BaseService } from '../../common/base.service';

@Injectable()
export class CollectionService extends BaseService {
  constructor(
    @InjectModel(CollectionData.name)
    private collectionModel: Model<CollectionDocument>
  ) {
    super();
  }

  count(query: FilterQuery<CollectionData>) {
    return this.collectionModel.count(query).exec();
  }

  create(collectionDto: CollectionDto): Promise<CollectionData> {
    return this.collectionModel.create(collectionDto);
  }

  update(id: string, collectionDto: CollectionDto) {
    return this.collectionModel.findByIdAndUpdate(id, collectionDto);
  }

  async find(
    query: QueryDto,
    sortby?: string
  ): Promise<{ data: CollectionData[]; total: number }> {
    const queryData: QueryDataDto = {};
    if (query.user_id) {
      queryData.user_id = query.user_id;
    }
    queryData.name = { $regex: escapeRegExp(query.name), $options: 'i' };

    const total = await this.count(queryData);
    const data = await this.collectionModel
      .find(queryData)
      .sort(sortby)
      .skip(this.getSkipNumber(query.page, query.limit))
      .limit(query.limit)
      .exec();

    return { data, total };
  }

  listDashboard(query: DATE) {
    let groupDate = [];
    const curr = new Date();
    if (query == DATE.WEEK) {
      const currDate = curr.getDate() - 8;
      curr.setHours(0, 0, 0, 0);
      curr.setDate(currDate);
      const firstDate = curr;
      const lastDate = new Date();
      lastDate.setHours(23, 59, 59);
      groupDate = [this.matchDate(firstDate, lastDate)];
    } else if (query == DATE.MONTH) {
      curr.setHours(0, 0, 0, 0);
      curr.setDate(1);
      const Date = endOfMonth(curr);
      groupDate = [this.matchDate(curr, Date)];
    } else if (query == DATE.YEAR) {
      const curr = new Date();
      curr.setHours(0, 0, 0, 0);
      curr.setMonth(0);
      const firstMonth = curr;
      const currMonth = new Date();
      groupDate = [
        this.matchDate(firstMonth, currMonth),
        { $sort: { createdAt: 1, _id: 1 } },
      ];
    } else {
      groupDate = [{ $sort: { createdAt: 1, _id: 1 } }];
    }
    return this.collectionModel.aggregate(groupDate);
  }

  delete(id: string) {
    return this.collectionModel.findByIdAndRemove(id);
  }

  findById(id: string) {
    return this.collectionModel.findById(id);
  }
}
