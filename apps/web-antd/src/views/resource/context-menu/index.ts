import type { PermissionType, ResourceVO } from '#/api/resource/model';

import {
  ContextMenuKeyEnum,
  ModuleTypeEnum,
  ResourceTypeEnum,
} from '@vben/constants';

import { ALL_MENU_ITEMS } from './menu-item';

// 菜单项类型
export interface MenuItem {
  key: ContextMenuKeyEnum;
  label?: string;
  icon?: any;
  type?: 'divider' | 'group';
  children?: MenuItem[];
  disabled?: boolean;
  hidden?: boolean;
  danger?: boolean;
  onClick?: (nodeData?: any) => void;
}

// 菜单配置选项
export interface MenuConfig {
  nodeData?: ResourceVO;
  enablePaste?: boolean;
  customFilter?: (item: MenuItem, nodeData?: ResourceVO) => boolean;
}

/**
 * 按资源类型，权限类型、模块来确定该节点的操作权限
 * @param node 资源信息
 * @param permissionType 权限类型
 * @param moduleTypeEnum 模块枚举
 */
export function calculateOperationPermissions(
  node: ResourceVO,
  permissionType: PermissionType,
  _moduleTypeEnum: ModuleTypeEnum,
) {
  return ALL_MENU_ITEMS.filter((item) => {
    if (item.hidden) {
      return false;
    }
    if (node && permissionType) {
      const resType = node.resType as ResourceTypeEnum;

      switch (item.key) {
        case ContextMenuKeyEnum.ADD_TABLE_MAPPING: {
          if (
            [ResourceTypeEnum.DATA_SOURCE].includes(resType) &&
            permissionType?.modify
          ) {
            return true;
          }
          break;
        }

        // 复制
        case ContextMenuKeyEnum.COPY: {
          if (
            permissionType?.read &&
            ![
              ResourceTypeEnum.DATA_SOURCES,
              ResourceTypeEnum.FOLDER,
              ResourceTypeEnum.PUBLIC_FOLDER,
              ResourceTypeEnum.SELF_FOLDER,
            ].includes(resType)
          ) {
            return true;
          }
          break;
        }

        // 删除
        case ContextMenuKeyEnum.DELETE: {
          if (
            ![
              ResourceTypeEnum.DATA_SOURCES,
              ResourceTypeEnum.PUBLIC_FOLDER,
              ResourceTypeEnum.SELF_FOLDER,
            ].includes(resType) &&
            permissionType?.delete
          ) {
            return true;
          }
          break;
        }

        // 编辑
        case ContextMenuKeyEnum.EDIT: {
          if (
            [
              ResourceTypeEnum.DATA_SOURCE,
              ResourceTypeEnum.SQL_DATASET,
            ].includes(resType) &&
            permissionType?.modify
          ) {
            return true;
          }
          break;
        }

        // 新建目录
        case ContextMenuKeyEnum.NEW_FOLDER: {
          if (
            [
              ResourceTypeEnum.DATA_SOURCES,
              ResourceTypeEnum.FOLDER,
              ResourceTypeEnum.PUBLIC_FOLDER,
              ResourceTypeEnum.SELF_FOLDER,
            ].includes(resType) &&
            permissionType?.modify
          ) {
            return true;
          }
          break;
        }

        // 粘贴
        case ContextMenuKeyEnum.PASTE: {
          if (permissionType?.modify && resType === ResourceTypeEnum.FOLDER) {
            return true;
          }
          break;
        }

        // 资源授权
        case ContextMenuKeyEnum.PERMISSION: {
          if (permissionType?.grant && node.resPid) {
            return true;
          }
          break;
        }
        // 属性
        case ContextMenuKeyEnum.PROPERTIES: {
          if (permissionType?.read) {
            return true;
          }
          break;
        }

        // 刷新
        case ContextMenuKeyEnum.REFRESH: {
          if (![ResourceTypeEnum.BASIC_FIELD].includes(resType)) {
            return true;
          }
          break;
        }
        // 排序
        case ContextMenuKeyEnum.SORT: {
          if (
            [ResourceTypeEnum.FOLDER].includes(resType) &&
            permissionType?.modify
          ) {
            return true;
          }
          break;
        }
        case ContextMenuKeyEnum.TABLE_STRUCTURE: {
          if (
            [ResourceTypeEnum.BASIC_TABLE].includes(resType) &&
            permissionType?.modify
          ) {
            return true;
          }
          break;
        }
        // 同步表
        case ContextMenuKeyEnum.TABLE_SYNC: {
          if (
            [ResourceTypeEnum.BASIC_TABLE].includes(resType) &&
            permissionType?.read
          ) {
            return true;
          }
          break;
        }

        default: {
          return false;
        }
      }
    }

    return false;
  });
}
