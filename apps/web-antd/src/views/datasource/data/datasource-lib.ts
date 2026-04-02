import { DataBaseCategoryEnum, DataBaseTypeEnum } from '@vben/constants';
import { SvgDsLibMysqlIcon } from '@vben/icons';

// 数据库
export interface DataBaseType {
  driverClass?: string;
  driverUrl?: string;
  icon: any;
  name: string;
  type: DataBaseTypeEnum;
}
// 数据库分类
export interface DataBaseCategory {
  children: DataBaseType[];
  label: string;
  name: DataBaseCategoryEnum;
  show: boolean;
}

export const dataBaseCategoryList: DataBaseCategory[] = [
  {
    name: DataBaseCategoryEnum.Relational,
    label: '关系型',
    children: [
      {
        name: 'MySql',
        type: DataBaseTypeEnum.MySql,
        icon: SvgDsLibMysqlIcon,
        driverClass: 'com.mysql.cj.jdbc.Driver',
        driverUrl: 'jdbc:mysql://{ip}:{port}/{database}',
      },
      {
        name: 'Oracle',
        type: DataBaseTypeEnum.Oracle,
        icon: SvgDsLibMysqlIcon,
        driverClass: 'oracle.jdbc.OracleDriver',
        driverUrl: 'jdbc:oracle://{ip}:{port}/{database}',
      },
    ],
    show: true,
  },
  {
    name: DataBaseCategoryEnum.Embedded,
    label: '嵌入式',
    children: [
      {
        name: 'DuckDB',
        type: DataBaseTypeEnum.DuckDB,
        icon: SvgDsLibMysqlIcon,
        driverClass: 'org.duckdb.DuckDBDriver',
        driverUrl: 'jdbc:duckdb:',
      },
    ],
    show: true,
  },
  {
    name: DataBaseCategoryEnum.File,
    label: '文件',
    children: [
      {
        name: 'Excel',
        type: DataBaseTypeEnum.Excel,
        icon: SvgDsLibMysqlIcon,
      },
    ],
    show: true,
  },
  {
    name: DataBaseCategoryEnum.Interface,
    label: '程序接口',
    children: [
      {
        name: 'Rest',
        type: DataBaseTypeEnum.Rest,
        icon: SvgDsLibMysqlIcon,
      },
      {
        name: 'WS',
        type: DataBaseTypeEnum.WebService,
        icon: SvgDsLibMysqlIcon,
      },
    ],
    show: true,
  },
];

export const getCategoryByType = (
  type: DataBaseTypeEnum,
): DataBaseCategory | undefined => {
  return dataBaseCategoryList.find((item) =>
    item.children.some((child) => child.type === type),
  );
};

export const getDataBaseByClassType = (
  type: DataBaseCategoryEnum,
): DataBaseType[] | undefined => {
  return dataBaseCategoryList.find((item) => item.name === type)?.children;
};

export const getDataBaseTypeByType = (
  type: DataBaseTypeEnum,
): DataBaseType | undefined => {
  return (
    dataBaseCategoryList
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce<DataBaseType[]>((prev, cur) => [...prev, ...cur.children], [])
      .find((item) => item.type === type)
  );
};
