import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Types } from 'mongoose';
import { categoryDto, QueryDataDto, QueryDto } from '../dto/category.dto';
import { CategoryData, CategoryDocument } from '../schema/category.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { escapeRegExp } from 'lodash';
import { BaseService } from '../../common/base.service';

@Injectable()
export class CategoryService extends BaseService {
  constructor(
    @InjectModel(CategoryData.name)
    private categoryModel: SoftDeleteModel<CategoryDocument>
  ) {
    super();
  }

  count(query: FilterQuery<CategoryData>) {
    return this.categoryModel.count(query).exec();
  }

  create(dto: categoryDto): Promise<CategoryData> {
    return this.categoryModel.create(dto);
  }

  async find(
    query: QueryDto,
    sortby: string
  ): Promise<{ data: CategoryData[]; total: number }> {
    const queryData: QueryDataDto = {};
    if (query.isDeleted) {
      queryData.isDeleted = true;
    }
    queryData.categoryName = {
      $regex: escapeRegExp(query.category_name),
      $options: 'i',
    };

    const total = await this.count(queryData);
    const data = await this.categoryModel
      .find({ ...queryData, category_name: queryData.categoryName })
      .sort(sortby)
      .skip(this.getSkipNumber(query.page, query.limit))
      .limit(query.limit)
      .exec();

    return { data, total };
  }

  update(id: string, dto: categoryDto) {
    return this.categoryModel.findByIdAndUpdate(id, dto, { new: true });
  }

  softDeleted(id: string) {
    return this.categoryModel.softDelete({ _id: new Types.ObjectId(id) });
  }

  restore(id: string) {
    return this.categoryModel.restore({ _id: new Types.ObjectId(id) });
  }

  findById(id: string) {
    return this.categoryModel.findById(id);
  }
}
