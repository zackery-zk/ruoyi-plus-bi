<script lang="ts" setup>
import type { ID } from '#/api/common';
import type { ResourceVO } from '#/api/resource/model';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import {
  ContextMenuKeyEnum,
  ModuleTypeEnum,
  ResourceTypeEnum,
  TabEventTypeEnum,
  TabModuleKey,
} from '@vben/constants';

import { ModulePage } from '#/components/module-page';
import { useModuleTabbarStore } from '#/store';

import selectTableModal from './modal/select-table-modal.vue';
import {
  datasourceModuleDefinition,
  ModuleDataSourceComponentEnum,
} from './module-tabs';

const moduleTabbarStore = useModuleTabbarStore();
moduleTabbarStore.registerModule(datasourceModuleDefinition);
const modulePageRef = ref();
const [SelectTableModal, selecTableModalApi] = useVbenModal({
  connectedComponent: selectTableModal,
});

function handleTabEvent(param: any) {
  const key = param.key;
  if (key === TabEventTypeEnum.NEW_DATASOURCE) {
    moduleTabbarStore.addTab(TabModuleKey.DATASOURCE, {
      componentKey: ModuleDataSourceComponentEnum.SOURCE_FORM,
      params: { type: param.data.type },
      title: '新建数据源',
    });
  }
}
function handleDoubleClick(data: ResourceVO) {
  if (data.resType === ResourceTypeEnum.DATA_SOURCE) {
    handleOpenDataSource(data);
  } else if (data.resType === ResourceTypeEnum.BASIC_TABLE) {
    handleOpenTableStructure(data);
  }
}

function handleOpenDataSource(data: ResourceVO) {
  moduleTabbarStore.addTab(TabModuleKey.DATASOURCE, {
    componentKey: ModuleDataSourceComponentEnum.SOURCE_FORM,
    title: data.resAlias || data.resName,
    resId: data.resId,
    params: {
      dsId: data.resId,
    },
  });
}

function handleOpenTableStructure(data: ResourceVO) {
  moduleTabbarStore.addTab(TabModuleKey.DATASOURCE, {
    componentKey: ModuleDataSourceComponentEnum.TABLE_STRUCTURE,
    title: data.resAlias || data.resName,
    resId: data.resId,
    params: {
      tableId: data.resId,
    },
  });
}

function handleClickMenuItem(key: ContextMenuKeyEnum, node: ResourceVO) {
  switch (key) {
    case ContextMenuKeyEnum.ADD_TABLE_MAPPING: {
      selecTableModalApi.setData({
        resId: node.resId,
      });
      selecTableModalApi.open();

      break;
    }
    case ContextMenuKeyEnum.EDIT: {
      handleOpenDataSource(node);
      break;
    }
    case ContextMenuKeyEnum.TABLE_STRUCTURE: {
      handleOpenTableStructure(node);
      break;
    }
    // No default
  }
}

function handleReload(resId: ID) {
  modulePageRef.value.handleReload(resId);
}
</script>

<template>
  <ModulePage
    :module="ModuleTypeEnum.DATA_SOURCE"
    :tab-module-key="TabModuleKey.DATASOURCE"
    @double-click="handleDoubleClick"
    @click-menu-item="handleClickMenuItem"
    ref="modulePageRef"
    @tab-event="handleTabEvent"
  >
    <SelectTableModal @reload="handleReload" />
  </ModulePage>
</template>
