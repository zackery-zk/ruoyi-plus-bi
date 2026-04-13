<script lang="tsx" setup>
import type { ResourceVO } from '#/api/resource/model';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { ModuleTypeEnum, ResourceTypeEnum } from '@vben/constants';

import { message } from 'antdv-next';

import ResourceTree from './resource-tree.vue';


const emit = defineEmits<{
  (e: 'select', data: ResourceVO): void;
}>();

const resourceTree = ref<ResourceVO[]>([]);
const moduleType = ref<ModuleTypeEnum>(ModuleTypeEnum.DATA_SOURCE);
const noSelfType = ref<ResourceTypeEnum>(ResourceTypeEnum.DATA_SOURCE);
const selectNode = ref<null | ResourceVO>(null);
const [BasicModal, basicModalApi] = useVbenModal({
  title: '选择资源',
  class:'max-h-[600px] h-[600px]',
  onConfirm: handleConfirm,
  confirmText:'确 定',
  showConfirmButton:false,
  draggable: true,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return;
    }
    basicModalApi.modalLoading(true);
    resourceTree.value = [];
    const { module, selectType } = basicModalApi.getData() as {
      module: ModuleTypeEnum;
      selectType: ResourceTypeEnum;
    };
    moduleType.value = module;
    noSelfType.value = selectType;
    basicModalApi.modalLoading(false);
  },
});

function handleNodeClick(node: ResourceVO) {
  if (noSelfType.value ===node.resType) {
    basicModalApi.setState({
      showConfirmButton: true,
    });
    selectNode.value = node;
  } else {
    basicModalApi.setState({
      showConfirmButton: false,
    });
  }
}

function handleConfirm() {
  if(selectNode.value){
    emit('select', selectNode.value as ResourceVO);
    basicModalApi.close();
    return;
  }
  message.warning('请选择资源')

}
</script>

<template>
  <BasicModal>
    <ResourceTree
      :module="moduleType"
      :no-self-type="noSelfType"
      @node-click="handleNodeClick"
      :show-context-menu="false"
    />
  </BasicModal>
</template>
