import { DataTypeEnum } from './field-type';

export enum DefaultDataFormatEnum {
  Date = '2019684358004092930',
  DateTime = '2019684457660755970',
  Float = '2019683745681846274',
  Integer = '2019673823632130049',
  String = '2019666045735751681',
  Time = '2019684406834180097',
}

export enum DataFormatTypeEnum {
  Date = 'Date',
  DateTime = 'DateTime',
  Float = 'Float',
  Integer = 'Integer',
  String = 'String',
  Time = 'Time',
}

export const dataFormatConvert = (type: DataTypeEnum): DataFormatTypeEnum => {
  switch (type) {
    case DataTypeEnum.BigDecimal:
    case DataTypeEnum.Double:
    case DataTypeEnum.Float: {
      return DataFormatTypeEnum.Float;
    }
    case DataTypeEnum.BigInteger:
    case DataTypeEnum.Integer:
    case DataTypeEnum.Long: {
      return DataFormatTypeEnum.Integer;
    }
    case DataTypeEnum.Date: {
      return DataFormatTypeEnum.Date;
    }
    case DataTypeEnum.DateTime: {
      return DataFormatTypeEnum.DateTime;
    }
    case DataTypeEnum.String: {
      return DataFormatTypeEnum.String;
    }
    case DataTypeEnum.Time: {
      return DataFormatTypeEnum.Time;
    }
  }
  return DataFormatTypeEnum.String;
};
