import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { formatISO, startOfDay, startOfMonth } from 'date-fns';
import { Model } from 'mongoose';
import { DATE } from '../components/enum';
import { LogData, LogDocument } from './log.schema';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(LogData.name) private LogModel: Model<LogDocument>
  ) {}

  async addView(id: string, ip: string) {
    return this.LogModel.create({
      asset_id: id,
      ip_address: ip,
    });
  }

  async groupDate(type: DATE) {
    let aggregatePipeline = [];

    const groupBy = {
      $group: {
        _id: {
          assetId: '$asset_Id',
          dayMonthYear: {
            $dateToString: { format: '%d/%m/%Y', date: '$createdAt' },
          },
        },
        count: { $sum: 1 },
      },
    };

    const sort = { $sort: { count: -1 } };
    const limit = { $limit: 5 };

    const current = new Date();
    if (type === DATE.DAY) {
      const setDate = formatISO(current);
      const startDate = new Date(startOfDay(new Date(setDate)));
      aggregatePipeline = [
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lt: new Date(),
            },
          },
        },
        groupBy,
        sort,
        limit,
      ];
    }
    if (type === DATE.WEEK) {
      const setDate = current.getDate() - 6;
      current.setHours(0, 0, 0, 0);
      current.setDate(setDate);
      aggregatePipeline = [
        {
          $match: {
            createdAt: {
              $gte: current,
              $lt: new Date(),
            },
          },
        },
        groupBy,
        sort,
        limit,
      ];
    }
    if (type === DATE.MONTH) {
      const first = startOfMonth(new Date());
      first.setHours(0, 0, 0, 0);
      aggregatePipeline = [
        { $match: { createdAt: { $gt: first, $lte: new Date() } } },
      ];
    }
    if (type === DATE.YEAR) {
      current.setHours(0, 0, 0, 0);
      current.setMonth(0);
      const firstMonth = current;
      aggregatePipeline = [
        {
          $match: {
            $and: [{ createdAt: { $gte: firstMonth, $lt: new Date() } }],
          },
        },
        {
          $group: {
            _id: {
              asset_id: '$asset_id',
            },
            count: { $sum: 1 },
          },
        },
        sort,
        limit,
      ];
    }

    return this.LogModel.aggregate(aggregatePipeline);
  }
}
