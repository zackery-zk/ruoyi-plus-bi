<script lang="tsx" setup>

import type { ID } from '#/api/common';
import type { ResourceVO } from '#/api/resource/model';

import { onMounted, ref } from 'vue';

import { getModuleResourceTypes, ModuleTypeEnum, ResourceTypeEnum } from '@vben/constants';

import { type BasicDataNode, Empty, type TreeProps } from 'antdv-next';

import { getChildrenWithType, getResourceById } from '#/api/resource';

import ResourceIcon from './resource-icon.vue'

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'selectResource', node: ResourceVO): void;
}>();

interface Props {
  rootResId: ID;
  module: ModuleTypeEnum;
}
const isLeafType = new Set([ResourceTypeEnum.BASIC_FIELD])

const resourceTree = ref<ResourceVO[]>([]);
const showTreeSkeleton = ref<boolean>(false);
const defaultExpandedKeys = ref<ID[]>([]);

// It's just a simple demo. You can use tree map to optimize update perf.
function updateTreeData(list: ResourceVO[], key: number | string, children: ResourceVO[]): ResourceVO[] {
  return list.map((node) => {
    if (node.resId === key) {
      return {
        ...node,
        children,
      }
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      }
    }
    return node
  })
}

const loadData: TreeProps['loadData'] = ({ key, children }) =>{
  return  new Promise<void>((resolve) => {
    if (children) {
      resolve()
      return
    }
    const types = getModuleResourceTypes(props.module);
    getChildrenWithType(key, types).then(ret => {
      ret.forEach((item) => {
          if (
            isLeafType.has(item.resType as ResourceTypeEnum)
          ) {
            item.isLeaf = true;
          }
        });
      resourceTree.value = updateTreeData(resourceTree.value, key, ret)
      resolve()
    })
  })
}



function handleDragStart(data:any) {
  const node = data.node as ResourceVO;
  if (!data.event.dataTransfer) return;
  data.event.dataTransfer.effectAllowed = 'copyMove';
  data.event.dataTransfer.setData('application/json', JSON.stringify(node));
}

function handleDoubleClick(option: BasicDataNode) {
  const node = option as ResourceVO;
  emit('selectResource', node);
}

function iconRender({ data }: { data: ResourceVO }) {
  return <ResourceIcon resIcon={data.resIcon} resType={data.resType as ResourceTypeEnum} />;
}
function titleRender(data: BasicDataNode) {
  const label = data.resAlias || data.resName;

  return (
    <div class="ml-1 flex w-full h-full items-center justify-between" onDblclick={() => handleDoubleClick(data)}>
      <div class="select-none">
        {label}
      </div>
    </div>
  );
}


onMounted(async () => {
  const data = await getResourceById(props.rootResId);
    data.isLeaf = false;
    defaultExpandedKeys.value = [data.resId];
    resourceTree.value = [data];
});
</script>

<template>
  <div :class="$attrs.class">
    <a-skeleton :loading="showTreeSkeleton" :paragraph="{ rows: 8 }" active>
      <a-config-provider
        :theme="{
          components: {
            Tree: {
              directoryNodeSelectedBg: 'hsl(var(--primary-100))',
              directoryNodeSelectedColor: 'hsl(var(--foreground))',
              titleHeight: 32,
              switcherSize: 16,
            },
          },
        }"
      >
        <a-directory-tree
          v-bind="$attrs"
          v-if="resourceTree.length > 0"
          :class="$attrs.class"
          :field-names="{ key: 'resId' }"
          :tree-data="resourceTree"
          :load-data="loadData"
          :virtual="false"
          :expand-action="false"
          :show-icon="true"
          :icon="iconRender"
          draggable
          @dragstart="handleDragStart"
          :classes="{
            item: 'bi-res-tree-item',
          }"
          :styles="{
            item: {
              '--ant-tree-node-selected-bg':
                'var(--ant-color-primary-bg-hover)',
            },
            itemTitle: {
              display: 'inline-block',
              width: 'calc(100% - 16px)',
            },
          }"
          :title-render="titleRender"
        />
        <div v-else class="mt-5">
          <Empty
            :image="Empty.PRESENTED_IMAGE_SIMPLE"
            description="无部门数据"
          />
        </div>
      </a-config-provider>
    </a-skeleton>
  </div>
</template>

<style scoped lang="scss">
.resource-tree {
  :deep(.n-tree-node) {
    height: 32px;
  }

  :deep(.n-tree-node-switcher) {
    height: 32px;
  }

  :deep(.n-tree-node-switcher__icon) {
    width: 16px !important;
    height: 16px !important;
    font-size: 16px !important;
  }

  :deep(.n-tree-node-content .n-tree-node-content__suffix) {
    display: none;
  }

  :deep(.n-tree-node-content:hover .n-tree-node-content__suffix) {
    display: block;
  }
}
</style>
