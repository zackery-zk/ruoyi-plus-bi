<script setup lang="tsx">

import type { ID } from '#/api/common';
import type { ResourceVO } from '#/api/resource/model';

import { onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { ContextMenuKeyEnum, getModuleResourceTypes, type ModuleTypeEnum, ResourceTypeEnum } from '@vben/constants';

import { SearchOutlined } from '@antdv-next/icons';
import { type BasicDataNode, Empty, Input, Modal, Skeleton, type TreeProps } from 'antdv-next';

import { syncTable } from '#/api/datasource';
import { getChildrenWithType, getModuleResources } from '#/api/resource';

import ContextMenu from './context-menu/index.vue';
import perminssionModel from './permission/permission-modal.vue'
import ResourceIcon from './resource-icon.vue';
import resourceModal from './resource-modal.vue';

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<Props>(), {
  showContextMenu: true,
  noSelfType: undefined,
})
const emit = defineEmits<{
  (e: 'doubleClick', data: ResourceVO): void;
  (e: 'clickMenuItem', key: ContextMenuKeyEnum, node: ResourceVO): void;
  (e: 'nodeClick', node: ResourceVO): void;
}>();
interface Props {
  /**
   * 模块
   */
  module: ModuleTypeEnum;

  /**
   * 不允许self的节点
   */
  noSelfType?:ResourceTypeEnum;

  /**
   * 显示后缀菜单
   */
  showContextMenu?:boolean;

}
const resId = ref<ID>();
const searchValue = ref<string>('');


const resourceTree = ref<ResourceVO[]>([]);
/** 骨架屏加载 */
const showTreeSkeleton = ref<boolean>(true);

const [ResourceModal, resourceModalApi] = useVbenModal({
  connectedComponent: resourceModal,
});

const [PerminssionModel,perminssionModelApi] = useVbenModal({
  connectedComponent:perminssionModel
})


async function loadModuleTree() {
  showTreeSkeleton.value = true;
  searchValue.value = '';

  const ret = await getModuleResources(props.module);
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
            isLeafType.has(item.resType as ResourceTypeEnum) || props.noSelfType === item.resType as ResourceTypeEnum
          ) {
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
      const types = getModuleResourceTypes(props.module);
      const result = await getChildrenWithType(item.resId,types,);
      result.forEach((item) => {
          if (
            isLeafType.has(item.resType as ResourceTypeEnum) || props.noSelfType === item.resType as ResourceTypeEnum
          ) {
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

const isLeafType = new Set([ResourceTypeEnum.BASIC_FIELD,ResourceTypeEnum.SQL_FIELD])



function titleRender(data: BasicDataNode) {
  const label = data.resAlias || data.resName;

  return (
    <div class="ml-1 flex w-full h-full items-center justify-between" onClick={()=>handleClick(data)} onDblclick={() => handleDoubleClick(data)}>
      <div class="select-none">
        {label}
      </div>
      {
        props.showContextMenu && (
          <div class="bi-res-tree-context-menu">
            <ContextMenu
            moduleTypeEnum={props.module}
            onClickContextMenu={handleClickContextMenu}
            onClickMenuItem={handleClickMenuItem}
            v-model:currentNode={data as ResourceVO}
            v-model:resId={resId.value}/>
          </div>
        )
      }
    </div>
  );
}

function handleClickContextMenu(key: ID) {
  resId.value = key;
}
function handleClickMenuItem(key: ContextMenuKeyEnum, node: ResourceVO) {
  switch (key) {
  case ContextMenuKeyEnum.NEW_FOLDER: {
    resourceModalApi.setData({
      resPid: node.resId,
      pName: node.resAlias || node.resName,
      resType: ResourceTypeEnum.FOLDER,
    });
    resourceModalApi.open();

  break;
  }
  case ContextMenuKeyEnum.PERMISSION: {
    perminssionModelApi.setData({resId:node.resId});
    perminssionModelApi.open();

  break;
  }
  case ContextMenuKeyEnum.PROPERTIES: {
    resourceModalApi.setData({
      resId: node.resId,
    });
    resourceModalApi.open();

  break;
  }
  case ContextMenuKeyEnum.REFRESH:{
    handleReload('',node.resId);
    break;
  }
  case ContextMenuKeyEnum.TABLE_SYNC:{
    Modal.confirm({
      title:'提示',
      content:'确定要同步表结构吗？',
      okText:'确 定',
      cancelText:'取消',
      async onOk(){
        await syncTable(node.resId);
      }
    })
    break;
  }
  default: {
    emit('clickMenuItem',key,node)
  }
  }
}

function iconRender({ data }: { data: ResourceVO }) {
  return <ResourceIcon resIcon={data.resIcon} resType={data.resType as ResourceTypeEnum} />;
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
        <!-- 固定在顶部 必须加上bg-background背景色 否则会产生'穿透'效果 -->
        <div
          class="sticky left-0 top-0 z-100 bg-background p-[5px] flex items-center gap-2"
        >
          <Input
            v-model:value="searchValue"
            :placeholder="$t('pages.common.search')"
            allow-clear
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </Input>
          <slot name="toolbar-actions"></slot>
        </div>
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
              v-if="resourceTree.length > 0"
              :class="$attrs.class"
              :field-names="{ key: 'resId' }"
              :tree-data="resourceTree"
              :load-data="loadData"
              :virtual="false"
              :expand-action="false"
              :show-icon="true"
              :icon="iconRender"
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
          <!-- 仅本人数据权限 可以考虑直接不显示 -->
        </div>
      </div>
    </Skeleton>

    <ResourceModal @reload="handleReload" />
    <PerminssionModel />
  </div>
</template>
<style lang="css" scoped>
:deep(.bi-res-tree-item:hover) {
  .bi-res-tree-context-menu {
    display: block;
  }
}
</style>
