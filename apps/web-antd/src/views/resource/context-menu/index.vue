<script setup lang="tsx">
import type { MenuItemType } from 'antdv-next';

import type { ContextMenuKeyEnum, ModuleTypeEnum } from '@vben/constants';

import type { ID } from '#/api/common';
import type { PermissionType, ResourceVO } from '#/api/resource/model';

import { nextTick, onMounted, onUnmounted, ref } from 'vue';

import { LoadingOutlined,MoreOutlined } from '@antdv-next/icons';

import { getPermissionType } from '#/api/resource';

import { calculateOperationPermissions } from '.';

const props = defineProps<{
  moduleTypeEnum: ModuleTypeEnum;
}>();

const emit = defineEmits<{
  (e: 'clickContextMenu', key: number | string): void;
  (
    e: 'clickMenuItem',
    key: ContextMenuKeyEnum,
    node: ResourceVO,
  ): void;
}>();

const loading = ref<boolean>(false);
const permissionType = ref<null | PermissionType>(null);
const resId = defineModel<ID | null>('resId', {
  required: false,
  default: () => null,
});
const currentNode = defineModel<ResourceVO>('currentNode', {
  required: false,
  default: () => null,
});

const menuItems = ref<MenuItemType[]>([]);

async function handleOpenContextMenu() {
  emit('clickContextMenu', currentNode.value.resId);
  nextTick(async () => {
    // 获取当前节点权限
    try {
      loading.value = true;
      const data = await getPermissionType(currentNode.value.resId);
      permissionType.value = data;
      menuItems.value = calculateOperationPermissions(
        currentNode.value,
        permissionType.value,
        props.moduleTypeEnum,
      );
    } finally {
      loading.value = false;
    }
  });
}

const handleClickOutside = () => {
  resId.value = null;
};
// 点击菜单
function handleSelect({key}: {key: ContextMenuKeyEnum}) {
  emit('clickMenuItem', key, currentNode.value);
}



onMounted(() => {
  document.body.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.body.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <a-dropdown
    :menu="{items:menuItems}"
    :open="resId === currentNode.resId"
    :trigger="['click']"
    @menu-click="handleSelect"
  >
    <div
      class="w-[16px] flex items-center justify-center"
      @click.stop="handleOpenContextMenu"
    >
      <template v-if="loading">
        <LoadingOutlined class="font-bold" />
      </template>
      <template v-else>
        <MoreOutlined class="font-bold" />
      </template>
    </div>
  </a-dropdown>
</template>
