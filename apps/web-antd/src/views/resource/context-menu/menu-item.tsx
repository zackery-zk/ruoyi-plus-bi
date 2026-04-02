import type { MenuItemType } from 'antdv-next';

import { markRaw } from 'vue';

import { ContextMenuKeyEnum } from '@vben/constants';

import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderAddOutlined,
  InfoOutlined,
  OrderedListOutlined,
  ReloadOutlined,
  SecurityScanOutlined,
  SyncOutlined,
  TableOutlined,
} from '@antdv-next/icons';

// 在这里以“树形结构”统一维护所有右键菜单项
export const ALL_MENU_ITEMS: MenuItemType[] = [
  {
    key: ContextMenuKeyEnum.NEW_FOLDER,
    label: '新建文件夹',
    icon: markRaw(FolderAddOutlined)
  },
  {
    key: ContextMenuKeyEnum.EDIT,
    icon: markRaw(EditOutlined),
    label: '编辑',
  },
  {
    key: ContextMenuKeyEnum.ADD_TABLE_MAPPING,
    label: '添加表映射',
    icon: markRaw(TableOutlined)
  },
  {
    key: ContextMenuKeyEnum.TABLE_SYNC,
    label: '同步表',
    icon: markRaw(SyncOutlined)
  },
  {
    key: ContextMenuKeyEnum.PERMISSION,
    label: '资源授权',
    icon: markRaw(SecurityScanOutlined)
  },
  {
    key: ContextMenuKeyEnum.SORT,
    label: '排序',
    icon: markRaw(OrderedListOutlined)
  },
  {
    key: ContextMenuKeyEnum.REFRESH,
    label: '刷新',
    icon: markRaw(ReloadOutlined)
  },

  {
    key: ContextMenuKeyEnum.COPY,
    label: '复制',
    icon: markRaw(CopyOutlined),
  },
  {
    key: ContextMenuKeyEnum.PASTE,
    label: '粘贴',
    icon: markRaw(CopyOutlined),
    disabled: true,
  },
  {
    key: ContextMenuKeyEnum.DELETE,
    label: '删除',
    icon: markRaw(DeleteOutlined)
  },

  {
    key: ContextMenuKeyEnum.PROPERTIES,
    label: '属性',
    icon: markRaw(InfoOutlined)
  },
];
