<script lang="ts" setup>
import type { ResourceVO } from '#/api/resource/model';

import {
  ModuleTypeEnum,
  TabEventTypeEnum,
  TabModuleKey,
} from '@vben/constants';

import { ModulePage } from '#/components/module-page';
import { ModuleTabbar } from '#/components/module-tabbar';
import { useModuleTabbarStore } from '#/store';

import { datasourceModuleDefinition } from './module-tabs';

const moduleTabbarStore = useModuleTabbarStore();

moduleTabbarStore.registerModule(datasourceModuleDefinition);

function handleTabEvent(param: any) {
  console.log(param);
  const key = param.key;
  if (key === TabEventTypeEnum.NEW_DATASOURCE) {
    moduleTabbarStore.addTab(TabModuleKey.DATASOURCE, {
      componentKey: 'source-form',
      params: { type: param.data.type },
      title: '新建数据源',
    });
  }
}
function handleDoubleClick(data: ResourceVO) {
  moduleTabbarStore.addTab(TabModuleKey.DATASOURCE, {
    componentKey: 'source-form',
    title: data.resAlias|| data.resName,
    resId:data.resId,
    params:{
      dsId:data.resId,
    }
  });
}
</script>

<template>
  <ModulePage
    :module="ModuleTypeEnum.DATA_SOURCE"
    @double-click="handleDoubleClick"
  >
    <ModuleTabbar module-key="datasource" @tab-event="handleTabEvent" />
  </ModulePage>
</template>
