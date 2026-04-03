import type { VxeGridProps } from '#/adapter/vxe-table';

import { renderDict } from '#/utils/render';

export const columns: VxeGridProps['columns'] = [
  {
    title: '类型',
    field: 'objectType',
    slots: {
      default: ({ row }) => {
        return renderDict(row.objectType, 'sys_object_type');
      },
    },
    width: 80,
  },
  {
    title: '名称',
    field: 'objectName',
  },
  {
    title: '权限',
    field: 'powerType',
    titlePrefix: {
      message: `选择编辑后会自动有引用、查看权限。`,
    },
    slots: { default: 'powerType' },
  },
  {
    title: '再授权',
    field: 'sublicense',
    titlePrefix: {
      message: `赋予后对方只能授权他自身有的权限`,
    },
    slots: { default: 'sublicense' },
  },
  {
    title: '应用于',
    field: 'applyTo',
    slots: { default: 'applyTo' },
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    width: 120,
  },
];
export const inheritedColumns: VxeGridProps['columns'] = [
  {
    title: '类型',
    field: 'objectType',
    slots: {
      default: ({ row }) => {
        return renderDict(row.objectType, 'sys_object_type');
      },
    },
    width: 80,
  },
  {
    title: '名称',
    field: 'objectName',
  },
  {
    title: '权限',
    field: 'powerType',
    slots: { default: 'powerType' },
  },
  {
    title: '再授权',
    field: 'sublicense',
    slots: { default: 'sublicense' },
  },
  {
    title: '应用于',
    field: 'applyTo',
    slots: { default: 'applyTo' },
  },
];
