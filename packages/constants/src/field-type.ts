
export enum DataTypeEnum {
  BigDecimal = 'BigDecimal',
  Bigint = 'Bigint',
  BigInteger='BigInteger',
  Date = 'Date',
  DateTime = 'DateTime',
  Double = 'Double',
  Float = 'Float',
  Integer = 'Integer',
  Long = 'Long',
  String = 'String',
  Time = 'Time',
  Unknown = 'Unknown',
}
export enum DataTypeClassEnum {
  Date = 'Date',
  Number = 'Number',
  String = 'String',
}

export const dataTypeOptions = [
  {
    label: '字符串',
    value: DataTypeEnum.String,
  },
  {
    label: '整型',
    value: DataTypeEnum.Integer,
  },
  {
    label: '长整型',
    value: DataTypeEnum.Long,
  },
  {
    label:'长浮点型',
    value:DataTypeEnum.BigDecimal
  },
  {
    label: '双精度浮点型',
    value: DataTypeEnum.Float,
  },
  {
    label: '单精度浮点型',
    value: DataTypeEnum.Double,
  },

  {
    label: '日期',
    value: DataTypeEnum.Date,
  },
  {
    label: '时间',
    value: DataTypeEnum.Time,
  },
  {
    label: '日期时间',
    value: DataTypeEnum.DateTime,
  },
  {
    label: '未知',
    value: DataTypeEnum.Unknown,
  },
];


export const getDataTypeClass = (type: DataTypeEnum): DataTypeClassEnum => {
  switch (type) {
    case DataTypeEnum.BigDecimal:
    case DataTypeEnum.Bigint:
    case DataTypeEnum.Double:
    case DataTypeEnum.Float:
    case DataTypeEnum.Integer: {
      return DataTypeClassEnum.Number;
    }

    case DataTypeEnum.Date:
    case DataTypeEnum.DateTime:
    case DataTypeEnum.Time: {
      return DataTypeClassEnum.Date;
    }
    default: {
      return DataTypeClassEnum.String;
    }
  }
};
