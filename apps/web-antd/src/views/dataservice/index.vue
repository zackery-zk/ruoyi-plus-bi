<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ModuleTabbar } from '#/components/module-tabbar';
import { useModuleTabbarStore } from '#/store';

import { dataserviceModuleDefinition } from './module-tabs';

const moduleTabbarStore = useModuleTabbarStore();

moduleTabbarStore.registerModule(dataserviceModuleDefinition);
</script>

<template>
  <Page :auto-content-height="true" content-class="!p-0">
    <ModuleTabbar module-key="dataservice" />
  </Page>
</template>
