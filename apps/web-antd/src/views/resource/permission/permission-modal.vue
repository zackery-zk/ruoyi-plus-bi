<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { Permission, ResourceVO } from '#/api/resource/model';

import { h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { LockOutlined } from '@antdv-next/icons';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getResourceById,
  getResourcePermission,
  saveResourcePermission,
} from '#/api/resource';

import { columns, inheritedColumns } from './permission-data';
import selectObjectModal from './select-object.vue';

const title = ref<string>('资源权限');

const permission = ref<Permission>({
  resId: '',
  ownerId: '',
  ownerName: '',
  inherited: '',
  inheritedPermissions: [],
  permissionDetail: [],
});

const resource = ref<ResourceVO>();

const gridOptions: VxeGridProps = {
  columns,
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  toolbarConfig: {
    enabled: false,
  },
  data: permission.value.permissionDetail,
  // 表格全局唯一表示 保存列配置需要用到
  id: 'resource-permission-detail-index',
};
const gridOptions1: VxeGridProps = {
  columns: inheritedColumns,
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  toolbarConfig: {
    enabled: false,
  },
  data: permission.value.inheritedPermissions,
  // 表格全局唯一表示 保存列配置需要用到
  id: 'resource-permission-detail-index',
};
const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});
const [InheritedBasicTable, newTableApi] = useVbenVxeGrid({
  gridOptions: gridOptions1,
});
const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);

    const { resId } = modalApi.getData() as {
      resId?: string;
    };
    if (resId) {
      resource.value = await getResourceById(resId);
      permission.value = await getResourcePermission(resId);
      title.value = `【${resource.value.resAlias || resource.value.resName}】资源授权`;
      tableApi.grid.loadData(permission.value.permissionDetail);
      newTableApi.grid.loadData(permission.value.inheritedPermissions);
    }
    modalApi.modalLoading(false);
  },
});

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    await saveResourcePermission(permission.value);
    await handleCancel();
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  modalApi.close();
}

const [SelectObjectModal, selectObjectmodalApi] = useVbenModal({
  connectedComponent: selectObjectModal,
});

const handleAuthorize = () => {
  selectObjectmodalApi.open();
};
const seletecObject = (objects: any[]) => {
  for (const item in objects) {
    const index = permission.value.permissionDetail.findIndex(
      (v: any) => v.objectId === objects[item].objectId,
    );
    if (index === -1) {
      permission.value.permissionDetail.push({
        objectId: objects[item].objectId,
        objectType: objects[item].objectType,
        objectName: objects[item].objectName,
        sublicense: '0',
        powerType: 'REF',
        applyTo: 'CURRENT_CHILD',
        resId: resource.value ? resource.value.resId : '',
      });
    }
  }
  tableApi.grid.loadData(permission.value.permissionDetail);
};

const cancelAuth = (row: any) => {
  const index = permission.value.permissionDetail.findIndex(
    (v: any) => v.objectId === row.objectId,
  );
  if (index !== -1) {
    permission.value.permissionDetail.splice(index, 1);
    tableApi.grid.loadData(permission.value.permissionDetail);
  }
};
</script>

<template>
  <BasicModal
    :close-on-click-modal="false"
    :title="title"
    class="w-[60%]"
    draggable
  >
    <a-form>
      <div class="flex justify-between">
        <a-form-item label="所属人">
          <a-space-compact>
            <a-input
              v-model:value="permission.ownerName"
              disabled
              style="width: calc(100% - 64px)"
            />
            <a-button type="primary">设置</a-button>
          </a-space-compact>
        </a-form-item>
        <a-form-item label="是否继承父节点权限">
          <a-switch
            v-model:checked="permission.inherited"
            checked-children="是"
            checked-value="1"
            un-checked-children="否"
            un-checked-value="0"
          />
        </a-form-item>
      </div>
      <a-divider title-placement="left">继承父节点的权限</a-divider>
      <InheritedBasicTable>
        <template #powerType="{ row }">
          {{
            row.powerType === 'REF'
              ? '引用'
              : row.powerType === 'RED'
                ? '查看'
                : row.powerType === 'MODIFY'
                  ? '编辑'
                  : '删除'
          }}
        </template>
        <template #sublicense="{ row }">
          {{ row.sublicense === '1' ? '是' : '否' }}
        </template>
        <template #applyTo="{ row }">
          {{ row.applyTo === 'CURRENT' ? '只有当前资源' : '该资源及子资源' }}
        </template>
      </InheritedBasicTable>
      <a-divider title-placement="left">节点本身权限</a-divider>

      <div class="mb-1 ml-2">
        <a-button
          :icon="h(LockOutlined)"
          type="primary"
          @click="handleAuthorize"
        >
          授 权
        </a-button>
      </div>
      <BasicTable>
        <template #powerType="{ row }">
          <a-select v-model:value="row.powerType" class="w-full">
            <a-select-option value="REF">引用</a-select-option>
            <a-select-option value="READ">查看</a-select-option>
            <a-select-option value="MODIFY">编辑</a-select-option>
            <a-select-option value="DELETE">删除</a-select-option>
          </a-select>
        </template>
        <template #sublicense="{ row }">
          <a-switch
            v-model:checked="row.sublicense"
            checked-children="是"
            checked-value="1"
            un-checked-children="否"
            un-checked-value="0"
          />
        </template>
        <template #applyTo="{ row }">
          <a-select v-model:value="row.applyTo" class="w-full">
            <a-select-option value="CURRENT">只有当前资源</a-select-option>
            <a-select-option value="CURRENT_CHILD">
              该资源及子资源
            </a-select-option>
          </a-select>
        </template>
        <template #action="{ row }">
          <action-button danger @click.stop="cancelAuth(row)">
            取消授权
          </action-button>
        </template>
      </BasicTable>
    </a-form>

    <SelectObjectModal @select-object="seletecObject" />
  </BasicModal>
</template>
