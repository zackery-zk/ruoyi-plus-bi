<script setup lang="ts">
import type { TabsProps } from 'antdv-next';

import type { ID } from '#/api/common';
import type { ModuleTabItem } from '#/components/module-tabbar';

import { onMounted, ref } from 'vue';

import { TabModuleKey } from '@vben/constants';

import { getTableById, updateBasicFields } from '#/api/datasource';
import { BiCardPanel } from '#/components/bi-card-panel';
import { useModuleTabbarStore } from '#/store';

import TableData from './components/table-data.vue';
import TableStructure from './components/table-structure.vue';

interface Props {
  tab: ModuleTabItem;
  params: Params;
}
interface Params {
  tableId?: ID;
}

const props = defineProps<Props>();
const loading = ref<boolean>(false);
const panelLoading = ref<boolean>(false);
const moduleTabbarStore = useModuleTabbarStore();


const table = ref<{
  tableAlias: string;
  tableName: string;
}>({
  tableName: '',
  tableAlias: '',
});
const tableStructureRef = ref<InstanceType<typeof TableStructure>>();
onMounted(async () => {});

const items: TabsProps['items'] = [
  {
    key: 'table',
    label: '表映射结构',
  },
  {
    key: 'data-preview',
    label: '数据预览',
  },
];

const activeKey = ref<string>('table');

async function handleSave() {
  try {
    loading.value = true;
    if (!props.params.tableId) {
      return;
    }
    await updateBasicFields(
      tableStructureRef.value?.getGridData?.() ?? [],
      props.params.tableId,
    );
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function handleClose() {
  moduleTabbarStore.closeTab(TabModuleKey.DATASOURCE, props.tab.id);
}

onMounted(async () => {
  table.value = await getTableById(props.params.tableId as ID);
});
</script>

<template>
  <BiCardPanel :loading="loading" :panel-loading="panelLoading">
    <div class="flex flex-col w-full h-full p-2">
      <a-tabs :items="items" v-model:active-key="activeKey" />
      <div class="h-full min-h-0 flex-1">
        <a-form layout="inline" v-if="activeKey === 'table'">
          <a-form-item label="表名">
            <a-input disabled v-model:value="table.tableName" />
          </a-form-item>
          <a-form-item label="别名">
            <a-input v-model:value="table.tableAlias" />
          </a-form-item>
        </a-form>
        <TableStructure
          v-if="activeKey === 'table'"
          :table-id="params.tableId"
          ref="tableStructureRef"
        />

        <TableData
          v-if="activeKey === 'data-preview'"
          :table-id="params.tableId"
        />
      </div>
    </div>

    <template #actions>
      <a-flex gap="12" justify="end">
        <a-button @click="handleClose">关 闭</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="handleSave"
          v-if="activeKey === 'table'"
        >
          保 存
        </a-button>
      </a-flex>
    </template>
  </BiCardPanel>
</template>
