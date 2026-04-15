<script setup lang="tsx">

import type { ResourceVO } from '#/api/resource/model';

import { onMounted, reactive, ref } from 'vue';

import { ModuleTypeEnum, ResourceTypeEnum } from '@vben/constants';

import { type BasicDataNode, Skeleton, type TreeProps } from 'antdv-next';

import { getChildrenWithType, getModuleResources } from '#/api/resource';

import ResourceIcon from './resource-icon.vue';

defineOptions({ inheritAttrs: false });

const emit = defineEmits<{
  (e: 'doubleClick', data: ResourceVO): void;
  (e: 'nodeClick', node: ResourceVO): void;
  (e: 'dragStart',event:MouseEvent, node: ResourceVO): void;
}>();

const searchValue = ref<string>('');


const resourceTree = ref<ResourceVO[]>([]);
/** 骨架屏加载 */
const showTreeSkeleton = ref<boolean>(true);


async function loadModuleTree() {
  showTreeSkeleton.value = true;
  searchValue.value = '';

  const ret = await getModuleResources(ModuleTypeEnum.MODEL_DATASET);
  resourceTree.value = ret;
  showTreeSkeleton.value = false;
}
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
const types = reactive<ResourceTypeEnum[]>([ResourceTypeEnum.SCHEMA,ResourceTypeEnum.BASIC_TABLE,ResourceTypeEnum.FOLDER,ResourceTypeEnum.SQL_DATASET,ResourceTypeEnum.DATA_SOURCE])
  const isLeafType = new Set([ResourceTypeEnum.BASIC_TABLE,ResourceTypeEnum.SQL_DATASET])


const loadData: TreeProps['loadData'] = ({ key, children }) =>{
  return  new Promise<void>((resolve) => {
    if (children) {
      resolve()
      return
    }
    getChildrenWithType(key, types).then(ret => {
      ret.forEach((item:any) => {
          if (isLeafType.has(item.resType as ResourceTypeEnum)) {
            item.isLeaf = true;
          }
        });
      resourceTree.value = updateTreeData(resourceTree.value, key, ret)
      resolve()
    })
  })
}



function treeAction(
  node: ResourceVO[],
  id: number | string,
  fn: (node: ResourceVO[], item: ResourceVO, index: number) => void,
) {
  node.some((item, index) => {
    if (item.resId === id) {
      fn(node, item, index);
      return true;
    }
    if (item.children && item.children.length > 0) {
      treeAction(item.children, id, fn);
    }
    return false;
  });
}
// 保存回调刷新指定节点
async function handleReload(_ressId: number | string, resPid: number | string) {
  treeAction(
    resourceTree.value,
    resPid,
    async (_node: ResourceVO[], item: ResourceVO, _index: number) => {
      const result = await getChildrenWithType(item.resId,types,);
      result.forEach((item:any) => {
          if (isLeafType.has(item.resType as ResourceTypeEnum)) {
            item.isLeaf = true;
          }
        });
      item.children = [...result];
    },
  );
}

function handleDoubleClick(data: BasicDataNode) {
  if(![ResourceTypeEnum.DATA_SOURCES,ResourceTypeEnum.FOLDER,ResourceTypeEnum.PUBLIC_FOLDER].includes(data.resType as ResourceTypeEnum)){
    emit('doubleClick', data as ResourceVO);
  }
}

function handleClick(data: BasicDataNode) {
  emit('nodeClick', data as ResourceVO);
}





function titleRender(data: BasicDataNode) {
  const label = data.resAlias || data.resName;

  return (
    <div class="ml-1 flex w-full h-full items-center justify-between" onClick={()=>handleClick(data)} onDblclick={() => handleDoubleClick(data)}>
      <div class="select-none">
        {label}
      </div>
    </div>
  );
}

function iconRender({ data }: { data: ResourceVO }) {
  return <ResourceIcon resIcon={data.resIcon} resType={data.resType as ResourceTypeEnum} />;
}

function handleDragStart({event, node}:any){
  emit('dragStart',event, node);
}

onMounted(loadModuleTree);

defineExpose({
  handleReload
})
</script>

<template>
  <div :class="$attrs.class">
    <Skeleton
      :loading="showTreeSkeleton"
      :paragraph="{ rows: 8 }"
      active
      class="p-[8px]"
    >
      <div class="flex h-full flex-col overflow-y-auto rounded-lg">
        <div class="h-full overflow-x-hidden px-[8px]">
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
              :class="$attrs.class"
              :field-names="{ key: 'resId' }"
              :tree-data="resourceTree"
              :load-data="loadData"
              :selectable="false"
              :virtual="false"
              :draggable="{ icon: false, nodeDraggable: () => true }"
              @dragstart="handleDragStart"
              :expand-action="false"
              :show-icon="true"
              :icon="iconRender"
              :classes="{
                item: 'bi-res-tree-item',
              }"
              :styles="{
                item: {
                  '--ant-tree-node-selected-bg': 'transparent',
                },
                itemTitle: {
                  display: 'inline-block',
                  width: 'calc(100% - 16px)',
                },
              }"
              :title-render="titleRender"
            />
          </a-config-provider>
          <!-- 仅本人数据权限 可以考虑直接不显示 -->
        </div>
      </div>
    </Skeleton>
  </div>
</template>
<style lang="css" scoped></style>
