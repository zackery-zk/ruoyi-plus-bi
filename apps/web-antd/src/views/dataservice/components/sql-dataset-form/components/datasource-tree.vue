<script lang="tsx" setup>
import type { VueNode } from 'antdv-next/dist/_util/type';

import type { SqlDatasetForm } from '#/api/dataservice/sql-dataset/model';

import { ModuleTypeEnum } from '@vben/constants';
import { SwitchIcon } from '@vben/icons';

import RootResourceTree from '#/views/resource/root-resource-tree.vue';
const emit = defineEmits<{
  (e: 'selectDatasource'): void;
}>();

const sqlDatasetForm = defineModel<SqlDatasetForm>('sqlDatasetForm', {
  required: true,
});
const dataSourceOption = defineModel<{ label: VueNode; value: string }[]>(
  'dataSourceOption',
  { required: true },
);
const treeLoading = defineModel<boolean>('treeLoading', { required: true });
function handleShowDataSourceModal(show: boolean) {
  if (show) {
    emit('selectDatasource');
  }
}
</script>

<template>
  <div class="w-[300px] h-full flex flex-col pr-3 border-r border-border">
    <div class="mb-2">
      <a-select
        class="w-full"
        :open="false"
        v-model:value="sqlDatasetForm.dsId"
        placeholder="请选择数据源"
        :show="false"
        :options="dataSourceOption"
        @open-change="handleShowDataSourceModal"
      >
        <template #suffixIcon>
          <SwitchIcon />
        </template>
      </a-select>
    </div>
    <div class="w-full flex-1">
      <a-spin :spinning="treeLoading">
        <template v-if="sqlDatasetForm.dsId">
          <RootResourceTree
            :root-res-id="sqlDatasetForm.dsId"
            :module="ModuleTypeEnum.DATA_SOURCE"
          />
        </template>
        <template v-else>
          <a-empty description="请选择数据源" />
        </template>
      </a-spin>
    </div>
  </div>
</template>
