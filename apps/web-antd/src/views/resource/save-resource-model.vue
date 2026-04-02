<script setup lang="ts">
import type { ID } from '#/api/common';
import type { ResourceVO } from '#/api/resource/model';

import { computed, h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import {
  getModuleResourceTypes,
  ModuleTypeEnum,
  ResourceTypeEnum,
} from '@vben/constants';
import { getPopupContainer } from '@vben/utils';

import { ArrowLeftOutlined, FolderAddOutlined, RollbackOutlined } from '@antdv-next/icons';
import { Empty, message, Skeleton, TreeSelect } from 'antdv-next';

import { getChildrenWithType, getModuleResources } from '#/api/resource';

import ResourceIcon from './resource-icon.vue';
import resourceModal from './resource-modal.vue';

const emit = defineEmits<{
  save: [data: { dirId: ID; resDesc: string; resName: string; }];
}>();

const DIR_TYPES = [
  ResourceTypeEnum.FOLDER,
  ResourceTypeEnum.DATA_SOURCES,
  ResourceTypeEnum.PUBLIC_FOLDER,
  ResourceTypeEnum.SELF_FOLDER,
] as const;

function isDirType(type: unknown): type is (typeof DIR_TYPES)[number] {
  return DIR_TYPES.includes(type as (typeof DIR_TYPES)[number]);
}

const currentModule = ref<ModuleTypeEnum>(ModuleTypeEnum.DATA_SOURCE);
const roots = ref<ResourceVO[]>([]);
const pathStack = ref<ResourceVO[]>([]);
const childrenDirs = ref<ResourceVO[]>([]);

const selectedDirId = ref<ID>();

const loading = ref<boolean>(false);
const resName = ref<string>('');
const resDesc = ref<string>('');

const allowedTypes = computed(() => getModuleResourceTypes(currentModule.value));

const isRootEmpty = computed(() => roots.value.length === 0 || pathStack.value.length === 0);

const childrenByParentId = ref<Record<string, ResourceVO[]>>({});
const nodeById = ref<Record<string, ResourceVO>>({});

async function loadChildren(parentId: ID) {
  loading.value = true;
  try {
    const ret = await getChildrenWithType(parentId, allowedTypes.value);
    const dirs = ret.filter((item) => isDirType(item.resType));
    childrenDirs.value = dirs;
    childrenByParentId.value[String(parentId)] = dirs;
    dirs.forEach((d) => {
      nodeById.value[String(d.resId)] = d;
    });
  } finally {
    loading.value = false;
  }
}

async function loadRoots() {
  roots.value = [];
  pathStack.value = [];
  childrenDirs.value = [];
  selectedDirId.value = undefined;
  childrenByParentId.value = {};
  nodeById.value = {};

  loading.value = true;
  try {
    const ret = await getModuleResources(currentModule.value);
    const onlyDirRoots = ret.filter((n) => isDirType(n.resType));
    roots.value = onlyDirRoots;
    onlyDirRoots.forEach((d) => {
      nodeById.value[String(d.resId)] = d;
    });

    const first = onlyDirRoots[0];
    if (!first) return;

    pathStack.value = [first];
    selectedDirId.value = first.resId;
    await loadChildren(first.resId);
  } finally {
    loading.value = false;
  }
}

async function applyPath(nextPath: ResourceVO[]) {
  pathStack.value = nextPath;
  const current = nextPath.at(-1);
  selectedDirId.value = current?.resId;
  if (current && current.resId !== undefined) {
    await loadChildren(current.resId);
  } else {
    childrenDirs.value = [];
  }
}

const expandedKeySet = computed(() => {
  const s = new Set<string>();
  pathStack.value.forEach((item) => s.add(String(item.resId)));
  return s;
});

type TreeNode = {
  children?: TreeNode[];
  fullName: string;
  id: ID;
  label: string;
};

function buildTreeNode(node: ResourceVO): TreeNode {
  const label = node.resAlias || node.resName;
  const key = String(node.resId);
  const children = childrenByParentId.value[key];

  const treeNode: TreeNode = {
    id: node.resId,
    label,
    fullName: label,
  };

  // 仅对当前路径上的节点展开子节点，避免无限递归。
  if (expandedKeySet.value.has(key) && Array.isArray(children)) {
    treeNode.children = children.map((c) => buildTreeNode(c));
  }

  return treeNode;
}

const treeData = computed<TreeNode[]>(() => roots.value.map((r) => buildTreeNode(r)));

function handleTreeSelectChange(value: ID | null) {
  if (value === null) return;

  const indexInPath = pathStack.value.findIndex((item) => item.resId === value);
  if (indexInPath !== -1) {
    void applyPath(pathStack.value.slice(0, indexInPath + 1));
    return;
  }

  // value 可能在某个路径节点的子节点里：找到它的父节点并拼接路径。
  const valueKey = String(value);
  const parentIndex = pathStack.value.findIndex((parent) => {
    const key = String(parent.resId);
    const children = childrenByParentId.value[key];
    return Array.isArray(children) && children.some((c) => String(c.resId) === valueKey);
  });

  if (parentIndex === -1) return;

  const parent = pathStack.value[parentIndex]!;
  const siblings = childrenByParentId.value[String(parent.resId)] ?? [];
  const childNode = siblings.find((c) => String(c.resId) === valueKey);
  if (!childNode) return;

  void applyPath([...pathStack.value.slice(0, parentIndex + 1), childNode]);
}

function handleSelectDir(item: ResourceVO) {
  void applyPath([...pathStack.value, item]);
}

function handleHome() {
  if (pathStack.value.length <= 1) return;
  void applyPath(pathStack.value.slice(0, 1));
}

function handleBack() {
  if (pathStack.value.length <= 1) return;
  void applyPath(pathStack.value.slice(0, -1));
}

const [NewFolderModal, newFolderModalApi] = useVbenModal({
  connectedComponent: resourceModal,
});

function handleOpenNewFolder() {
  const current = pathStack.value.at(-1);
  if (!current) return;

  newFolderModalApi.setData({
    resPid: current.resId,
    pName: current.resAlias || current.resName,
    resType: ResourceTypeEnum.FOLDER,
  });
  newFolderModalApi.open();
}

async function handleNewFolderReload(_resId: ID, _resPid: ID) {
  const current = pathStack.value.at(-1);
  if (!current) return;
  await loadChildren(current.resId);
}

const [BasicModel, modelApi] = useVbenModal({
  title: '保存资源',
  draggable: true,
  class: 'w-[820px] h-[620px]',
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) return null;
    resName.value = '';
    resDesc.value = '';
    const data = modelApi.getData() as {
      module: ModuleTypeEnum;
    };
    currentModule.value = data.module;
    if (!data.module) {
      message.warning('请选择模块');
      return;
    }
    await loadRoots();
  },
});

async function handleCancel() {
  resName.value = '';
  resDesc.value = '';
  modelApi.close();
}

async function handleConfirm() {
  try {
    if (!selectedDirId.value) {
      message.warning('请选择保存目录');
      return;
    }

    const trimmedName = resName.value.trim();
    if (!trimmedName) {
      message.warning('请输入名称');
      return;
    }

    modelApi.modalLoading(true);

    emit('save', {
      resName: trimmedName,
      resDesc: resDesc.value.trim(),
      dirId: selectedDirId.value,
    });
  } catch (error) {
    console.error(error);
  } finally {
    modelApi.modalLoading(false);
  }
}
</script>

<template>
  <BasicModel>
    <div class="flex h-full flex-col gap-3">
      <!-- 顶部：目录选择 + 右侧图标按钮 -->
      <div class="flex items-center gap-3">
        <TreeSelect
          class="flex-1"
          :disabled="isRootEmpty"
          v-model:value="selectedDirId"
          :allow-clear="false"
          :field-names="{ label: 'label', value: 'id' }"
          :get-popup-container="getPopupContainer"
          :tree-data="treeData"
          :tree-default-expand-all="false"
          :tree-line="{ showLeafIcon: false }"
          placeholder="请选择目录"
          tree-node-filter-prop="label"
          tree-node-label-prop="fullName"
          @change="handleTreeSelectChange"
        />
        <div class="flex items-center gap-2">
          <a-button :disabled="isRootEmpty" :icon="h(RollbackOutlined)" @click="handleHome" />
          <a-button
            :disabled="pathStack.length <= 1"
            :icon="h(ArrowLeftOutlined)"
            @click="handleBack"
          />
          <a-button
            :disabled="isRootEmpty"
            :icon="h(FolderAddOutlined)"
            @click="handleOpenNewFolder"
          />
        </div>
      </div>

      <!-- 中间：目录列表 -->
      <div class="flex-1 overflow-hidden">
        <Skeleton :loading="loading" active :paragraph="{ rows: 6 }" />
        <div
          v-if="!loading"
          class="h-full overflow-y-auto rounded-md border p-3"
        >
          <template v-if="childrenDirs.length > 0">
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="item in childrenDirs"
                :key="item.resId"
                class="cursor-pointer rounded-md border bg-background p-2 hover:border-primary-500/40 hover:bg-primary-50/40"
                :class="{
                  'border-primary-500/60 bg-primary-50/50': item.resId === selectedDirId,
                }"
                @click="handleSelectDir(item)"
              >
                <div class="flex items-center gap-2">
                  <div class="h-[24px] w-[24px]">
                    <ResourceIcon
                      :res-icon="item.resIcon"
                      :res-type="item.resType as ResourceTypeEnum"
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="truncate font-medium">
                      {{ item.resAlias || item.resName }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="mt-6">
              <Empty :image="Empty.PRESENTED_IMAGE_SIMPLE" description="暂无目录" />
            </div>
          </template>
        </div>
      </div>

      <!-- 下方：名称 + 描述 -->
      <div class="border-t pt-3">
        <div class="grid grid-cols-1 gap-3">
          <div class="flex items-center gap-2">
            <div class="mb-1 text-sm font-medium w-[52px]">名称</div>
            <a-input v-model:value="resName" placeholder="请输入名称" :disabled="isRootEmpty" />
          </div>
          <div class="flex items-center gap-2 ">
            <div class="mb-1 text-sm font-medium w-[52px]">描述</div>
            <a-input
              v-model:value="resDesc"
              placeholder="请输入描述"
              :disabled="isRootEmpty"
            />
          </div>
        </div>
      </div>

      <!-- 新建文件夹弹窗（右上角按钮触发） -->
      <NewFolderModal @reload="handleNewFolderReload" />
    </div>
  </BasicModel>
</template>
