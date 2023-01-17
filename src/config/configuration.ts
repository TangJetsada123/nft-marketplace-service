import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import _ from 'lodash';

export async function validateData(data) {
  const env: object = await plainToClass(data, process.env);
  const errors = await validate(env);
  let errorArray: string[] = [];
  if (errors.length) {
    const setError = _.head(errors).constraints;
    errorArray = _.values(setError).map((data: string) => data);
    throw new Error(`${errorArray}`);
  }
  return env;
}
