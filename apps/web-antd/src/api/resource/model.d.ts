import type { BaseEntity } from '#/api/common';

/**
 * 资源所有权限
 */
export interface PermissionType {
  ref: boolean;
  read: boolean;
  modify: boolean;
  delete: boolean;
  grant: boolean;
  builtIn: boolean;
}

export interface ResourceVO {
  /**
   * 资源ID
   */
  resId: number | string;

  /**
   * 资源名称
   */
  resName: string;

  /**
   * 资源别名
   */
  resAlias: string;

  /**
   * 资源描述
   */
  resDesc: string;

  /**
   * 资源类型
   */
  resType: string;

  /**
   * 资源图标
   */
  resIcon: string;

  /**
   * 资源路径编码
   */
  resPathCode: string;
  /**
   * 资源父节点
   */
  resPid: number | string;

  /**
   * 资源排序
   */
  resSort: number;

  /**
   * 子对象
   */
  children: ResourceVO[];

  /**
   * 权限信息
   */
  permission: any;

  /**
   * 创建人
   */
  createName: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 修改人
   */
  updateName: string;
  /**
   * 修改时间
   */
  updateTime: string;
}

export interface ResourceForm extends BaseEntity {
  /**
   * 资源ID
   */
  resId?: number | string;

  /**
   * 资源名称
   */
  resName?: string;
  /**
   * 资源别名
   */
  resAlias?: string;

  /**
   * 资源类型
   */
  resType?: string;

  /**
   * 资源图标
   */
  resIcon?: string;

  /**
   * 资源路径编码
   */
  resPathCode?: string;

  /**
   * 资源父节点
   */
  resPid?: number | string;
  /**
   * 资源排序
   */
  resSort: number;

  /**
   * 资源权限
   */
  resPermission?: string;
}

/**
 * @description: 资源树
 */
export interface ResourceTree {
  id: number;
  /**
   * antd组件必须要这个属性 实际是没有这个属性的
   */
  key: string;
  parentId: number;
  label: string;
  weight: number;
  children?: ResourceTree[];
}

/**
 * 资源权限类型
 */
export enum PermissionTypeEnum {
  DELETE = 'DELETE',
  MODIFY = 'MODIFY',
  READ = 'READ',
  REF = 'REF',
}


export interface Permission {
  resId: number | string;
  ownerId: number | string;
  ownerName: string;
  inherited: string;
  inheritedPermissions: ResourcePermissionDetail[];
  permissionDetail: ResourcePermissionDetail[];
}

export interface ResourcePermissionDetail {
  perId?: number | string;
  resId: number | string;
  objectId: number | string;
  objectName: string;
  objectType: string;
  powerType: string;
  sublicense: string;
  applyTo: string;
}
