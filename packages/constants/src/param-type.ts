export enum ParamDataTypeEnum{
  AUTO="AUTO",
  BIGINT="BIGINT",
  BOOLEAN="BOOLEAN",
  DATE="DATE",
  DATE_TIME="DATE_TIME",
  DOUBLE="DOUBLE",
  FLOAT="FLOAT",
  INTEGER="INTEGER",
  LONG="LONG",
  STRING="STRING",
  TIME="TIME",
}
export const paramDataTypeOption = [
  {
    label: '字符串',
    value: ParamDataTypeEnum.STRING,
  },
  {
    label: '整型',
    value: ParamDataTypeEnum.INTEGER,
  },
  {
    label: '长整型',
    value: ParamDataTypeEnum.LONG,
  },
  {
    label: '浮点型',
    value: ParamDataTypeEnum.FLOAT,
  },
  {
    label: '长浮点型',
    value: ParamDataTypeEnum.DOUBLE,
  },
  {
    label: '日期',
    value: ParamDataTypeEnum.DATE,
  },
  {
    label: '时间',
    value: ParamDataTypeEnum.TIME,
  },
  {
    label: '日期时间',
    value: ParamDataTypeEnum.DATE_TIME,
  },
];
