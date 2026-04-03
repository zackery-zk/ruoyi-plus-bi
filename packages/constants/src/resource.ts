export enum ResourceTypeEnum {
  BASIC_FIELD='BASIC_FIELD',
  BASIC_TABLE = 'BASIC_TABLE', //基础表
  DATA_SOURCE = 'DATA_SOURCE', // 数据源
  DATA_SOURCES = 'DATA_SOURCES', // 数据源目录
  FOLDER = 'FOLDER', // 目录

  PUBLIC_FOLDER = 'PUBLIC_FOLDER', // 公共目录

  SCHEMA='SCHEMA',
  SELF_FOLDER = 'SELF_FOLDER', //我的空间
}

/**
 * 根据模块类型获取该模块允许查询的类型
 * @param model 模块类型
 */
export const getModuleResourceTypes = (
  model: ModuleTypeEnum,
): ResourceTypeEnum[] => {
  switch (model) {
    case ModuleTypeEnum.DATA_SOURCE: {
      return [
        ResourceTypeEnum.DATA_SOURCE,
        ResourceTypeEnum.DATA_SOURCES,
        ResourceTypeEnum.SCHEMA,
        ResourceTypeEnum.BASIC_TABLE,
        ResourceTypeEnum.BASIC_FIELD,
        ResourceTypeEnum.FOLDER,
      ];
    }
  }
  return [];
};

export enum ModuleTypeEnum {
  DATA_SOURCE = 'DATA_SOURCE',
  DATA_WORKBENCH = 'DATA_WORKBENCH',
}

export const ResourceTypeOptions = [
  {
    value: ResourceTypeEnum.BASIC_TABLE,
    label: '基础表',
  },
  {
    value: ResourceTypeEnum.PUBLIC_FOLDER,
    label: '公共目录',
  },
  {
    value: ResourceTypeEnum.FOLDER,
    label: '目录',
  },
  {
    value: ResourceTypeEnum.DATA_SOURCES,
    label: '数据源目录',
  },
  {
    value: ResourceTypeEnum.DATA_SOURCE,
    label: '数据源',
  },
];

// 统一维护资源树右键菜单 key（使用 enum/字符串字面量，避免散落魔法字符串）
export enum ContextMenuKeyEnum {
  // 添加表映射
  ADD_TABLE_MAPPING = 'ADD_TABLE_MAPPING',
  COPY = 'COPY',
  DELETE = 'DELETE',
  DIVIDER_1 = 'DIVIDER_1',
  DIVIDER_2 = 'DIVIDER_2',
  EDIT = 'EDIT',

  NEW = 'NEW',

  NEW_DATASET = 'NEW_DATASET',
  NEW_DATASOURCE = 'NEW_DATASOURCE',
  // 新建目录
  NEW_FOLDER = 'NEW_FOLDER',

  NEW_FORM = 'NEW_FORM',
  NEW_MASK_RULE = 'NEW_MASK_RULE',
  PASTE = 'PASTE',
  PERMISSION = 'PERMISSION',
  PREVIEW_DATA = 'PREVIEW_DATA',

  PROPERTIES = 'PROPERTIES',
  REFRESH = 'refresh',
  SORT = 'SORT',

  // 数据快查
  TABLE_DATA_PREVIEW = 'TABLE_DATA_PREVIEW',

  // 表结构
  TABLE_STRUCTURE = 'TABLE_STRUCTURE',

  // 同步表
  TABLE_SYNC = 'TABLE_SYNC',
}

/** 资源权限类型 */
export enum PermissionTypeEnum {
  DELETE = 'DELETE', // 删除
  GRANT = 'GRANT', // 再授权
  MODIFY = 'MODIFY', // 编辑
  READ = 'READ', // 查看
  REF = 'REF', // 引用
}
