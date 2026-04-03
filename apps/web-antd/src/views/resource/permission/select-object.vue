<script setup lang="ts">
import type { User } from '#/api/system/user/model';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { roleOptionSelect } from '#/api/system/role';
import { getDeptTree, listUserByDeptId } from '#/api/system/user';

const emits = defineEmits<{
  (e: 'selectObject', node: any[]): void;
}>();

const activeKey = ref<string>('user-dept');

const selectObjects = ref<any[]>([]);

const roleList = ref<any>([]);
const deptTree = ref<any>();
const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);
    selectObjects.value = [];
    roleList.value = await roleOptionSelect();
    deptTree.value = await getDeptTree();
    modalApi.modalLoading(false);
  },
});
const onLoadData = (treeNode: any) => {
  return new Promise<void>((resolve: any) => {
    if (treeNode.dataRef.initUser) {
      resolve();
    } else {
      listUserByDeptId(treeNode.dataRef?.id).then((result: User[]) => {
        const userList = [];
        if (result) {
          for (const item in result) {
            userList.push({
              id: result[item]?.userId,
              label: result[item]?.nickName ?? result[item]?.userName,
              type: 'USER',
              isLeaf: true,
            });
          }
        }
        treeNode.dataRef.children = treeNode.dataRef.children || [];
        treeNode.dataRef.children = [...treeNode.dataRef.children, ...userList];
        deptTree.value = [...deptTree.value];
        treeNode.dataRef.initUser = true;
        resolve();
      });
    }
  });
};

const checkRepeat = (objectId: number | string) => {
  const index = selectObjects.value.findIndex((v) => v.objectId === objectId);
  return index !== -1;
};

const handleSelectRole = (_e: any, node: any) => {
  if (checkRepeat(node.id)) {
    return;
  }
  selectObjects.value.push({
    objectId: node.roleId,
    objectName: node.roleName,
    objectType: 'ROLE',
  });
};
const handleUserOrDept = (_e: any, node: any) => {
  if (checkRepeat(node.id)) {
    return;
  }
  if (node.type === 'USER') {
    selectObjects.value.push({
      objectId: node.id,
      objectName: node.label,
      objectType: 'USER',
    });
  } else if (node.type === 'DEPT') {
    selectObjects.value.push({
      objectId: node.id,
      objectName: node.label,
      objectType: 'DEPT',
    });
  }
};
const deselect = (_e: any, node: any) => {
  const index = selectObjects.value.findIndex(
    (v: any) => v.objectId === node.objectId,
  );
  if (index !== -1) {
    selectObjects.value.splice(index, 1);
  }
};

async function handleCancel() {
  modalApi.close();
}

async function handleConfirm() {
  emits('selectObject', selectObjects.value);
  handleCancel();
}
</script>

<template>
  <BasicModal
    :close-on-click-modal="false"
    class="w-[40%]"
    draggable
    title="选择授权对象"
  >
    <div class="flex h-[400px] gap-3">
      <div
        class="w-[50%] p-1"
        style="border: 1px solid hsl(240deg 5.9% 90%); border-radius: 10px"
      >
        <a-tabs v-model:active-key="activeKey">
          <a-tab-pane key="user-dept" tab="用户/组">
            <a-tree
              :field-names="{ title: 'label', key: 'id' }"
              :height="338"
              :load-data="onLoadData"
              :tree-data="deptTree"
              block-node
              @dblclick="handleUserOrDept"
            />
          </a-tab-pane>
          <a-tab-pane key="role" tab="角色">
            <a-tree
              :field-names="{ key: 'roleId', title: 'roleName' }"
              :height="390"
              :tree-data="roleList"
              block-node
              @dblclick="handleSelectRole"
            />
          </a-tab-pane>
        </a-tabs>
      </div>

      <div
        class="h-full w-[50%]"
        style="border: 1px solid hsl(240deg 5.9% 90%); border-radius: 10px"
      >
        <a-tree
          :field-names="{ key: 'objectId', title: 'objectName' }"
          :height="390"
          :tree-data="selectObjects"
          block-node
          @dblclick="deselect"
        />
      </div>
    </div>
  </BasicModal>
</template>

<style scoped>
.object-item:hover {
  background-color: hsl(var(--background-deep));
}
</style>
