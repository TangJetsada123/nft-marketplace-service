export class BaseService {
  protected getSkipNumber(page: number, limit: number) {
    return (page - 1) * limit;
  }
  protected matchDate(start: Date, end: Date) {
    return { $match: { createdAt: { $gte: start, $lt: end } } };
  }

  protected groupAndCount() {
    return {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        list: { $push: '$$ROOT' },
        count: { $sum: 1 },
      },
    };
  }
}
