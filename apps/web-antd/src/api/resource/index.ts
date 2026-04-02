import type { ID } from '../common';

import type { PermissionType, ResourceForm, ResourceVO } from '#/api/resource/model.d';

import { ModuleTypeEnum, ResourceTypeEnum } from '@vben/constants';

import { alovaInstance } from '#/utils/http';

/**
 * 根据模块获取初始资源列表
 * @param module 模块类型
 * @returns 资源列表
 */
export function getModuleResources(module: ModuleTypeEnum) {
  return alovaInstance.post<ResourceVO[]>(
    `/resource/module`,
    {},
    {
      params: {
        module,
      },
    },
  );
}
/**
 * 根据父节点ID获取指定类型的字段
 * @param parentId 父节点ID
 * @param types 资源类型集合
 * @returns 资源列表
 */
export function getChildrenWithType(parentId: ID, types: ResourceTypeEnum[]) {
  return alovaInstance.post<ResourceVO[]>(`/resource/childrenWithType`, {
    id: parentId,
    types,
  });
}

/**
 *根据资源Id获取资源权限
 * @param id 资源ID
 */
export function getPermissionType(id: ID) {
  return alovaInstance.post<PermissionType>(`/resource/permission/auth`, {
    id,
  });
}

/**
 * 根据资源ID获取资源信息
 */
export function getResourceById(id: ID) {
  return alovaInstance.post<PermissionType>(`/resource/get`, {
    id,
  });
}
/**
 *创建系统资源
 * @param form 传递资源信息
 * @returns 资源主键
 */
 export function createResource(data: ResourceForm) {
  return alovaInstance.post<number>(`/resource/create`, data);
}

/**
 *修改系统资源
 * @param data 传递资源信息
 * @returns 资源主键
 */
 export function updateResource(data: ResourceForm) {
  return alovaInstance.post<string>(`/resource/update`, data);
}
