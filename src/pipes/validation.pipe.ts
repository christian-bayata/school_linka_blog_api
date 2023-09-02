import { PipeTransform, BadRequestException, ArgumentMetadata, Injectable } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      const errorMessages = error.details.map((d) => d.message);
      throw new BadRequestException(...errorMessages);
    }
    return value;
  }
}
