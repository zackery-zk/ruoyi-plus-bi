<script lang="ts" setup>
import type { MenuItemType } from 'antdv-next';

import type { ResourceVO } from '#/api/resource/model';

import { h, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  ContextMenuKeyEnum,
  ModuleTypeEnum,
  ResourceTypeEnum,
  TabEventTypeEnum,
  TabModuleKey,
} from '@vben/constants';

import { PlusOutlined } from '@antdv-next/icons';

import { ModulePage } from '#/components/module-page';
import { useModuleTabbarStore } from '#/store';

import {
  dataserviceModuleDefinition,
  ModuleDataServiceComponentEnum,
} from './module-tabs';
const moduleTabbarStore = useModuleTabbarStore();
moduleTabbarStore.registerModule(dataserviceModuleDefinition);

const router = useRouter();
const modulePageRef = ref();

const items: MenuItemType[] = [
  {
    key: 'SQL_DATASET',
    label: 'SQL数据集',
  },
  {
    key: 'MODEL_DATASET',
    label: '数据模型',
  },
  {
    key: 'API_DATASET',
    label: 'API数据集',
  },
  {
    key: 'EXCEL_DATASET',
    label: 'EXCEL数据集',
  },
];

function handleDoubleClick(data: ResourceVO) {
  if (data.resType === ResourceTypeEnum.SQL_DATASET) {
    handleOpenSqlDataset(data);
  }else if(data.resType === ResourceTypeEnum.MODEL_DATASET){
    handleOpenModelDataset(data);
  }
}

function handleOpenSqlDataset(data: ResourceVO) {
  moduleTabbarStore.addTab(TabModuleKey.DATA_SERVICE, {
    componentKey: ModuleDataServiceComponentEnum.SQL_DATASET_FORM,
    title: data.resAlias || data.resName,
    resId: data.resId,
    params: {
      resId: data.resId,
    },
  });
}

function handleOpenModelDataset(data: ResourceVO) {
  moduleTabbarStore.addTab(TabModuleKey.DATA_SERVICE, {
    componentKey: ModuleDataServiceComponentEnum.MODEL_DATASET_FORM,
    title: data.resAlias || data.resName,
    resId: data.resId,
    params: {
      resId: data.resId,
    },
  });
}

function handleClickMenuItem(key: ContextMenuKeyEnum, node: ResourceVO) {
  if (key === ContextMenuKeyEnum.EDIT) {
    handleOpenSqlDataset(node);
  }
}

function handleTabEvent(param: any) {
  const key = param.key;
  if (key === TabEventTypeEnum.NEW_DATASET) {
    const resId = param.data.resId;
    modulePageRef.value.handleReload(resId);
  }
}

function onClick({ key }: any) {
  switch (key) {
    case 'MODEL_DATASET': {
      router.push('/bi/model/datset');
      break;
    }
    case 'SQL_DATASET': {
      moduleTabbarStore.addTab(TabModuleKey.DATA_SERVICE, {
        componentKey: ModuleDataServiceComponentEnum.SQL_DATASET_FORM,
        title: '新建SQL数据集',
      });
      break;
    }
  }
  modulePageRef.value.handleCollspan(true);
}
</script>

<template>
  <ModulePage
    :module="ModuleTypeEnum.DATA_SERVICE"
    :tab-module-key="TabModuleKey.DATA_SERVICE"
    @double-click="handleDoubleClick"
    @click-menu-item="handleClickMenuItem"
    ref="modulePageRef"
     @tab-event="handleTabEvent"
  >
    <template #toolbar-actions>
      <a-dropdown
        :menu="{ items }"
        placement="bottomLeft"
        arrow
        @menu-click="onClick"
      >
        <a-button type="primary" :icon="h(PlusOutlined)" />
      </a-dropdown>
    </template>
  </ModulePage>
</template>
