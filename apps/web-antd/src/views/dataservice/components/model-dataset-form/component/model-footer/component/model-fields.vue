<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DataFormatVO } from '#/api/basic/model';
import type { BasicTable } from '#/api/datasource/table/model';

import { onMounted, reactive, ref } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDataFormatList } from '#/api/basic';
import { BiLoading } from '#/components/bi-loading';

import { useModelDataSetStore } from '../../../store/useModelDataSetStore';
import { vxeTableColumns } from './table-structure';

const loading = ref<boolean>(false);
const dataFormats = reactive<DataFormatVO[]>([]);
const modelDataSetStore = useModelDataSetStore();
const gridOptions: VxeGridProps & { class: string } = {
  checkboxConfig: {
    highlight: true,
    reserve: true,
    trigger: 'row',
  },
  class: '!p-0',
  size: 'small',
  editConfig: { trigger: 'click', mode: 'cell', showStatus: true },
  border: true,
  columns: vxeTableColumns(dataFormats),
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: ajaxQuery,
    },
  },
  rowConfig: {
    keyField: 'fieldId',
  },
  id: 'field-info-index',
};
const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});

async function ajaxQuery() {
  try {
    loading.value = true;
    const modelNode = modelDataSetStore.getSelectedModelNode();
    if (!modelNode) {
      return {
        rows: [],
      };
    }
    return {
      rows: modelNode.nodeFields,
    };
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 200);
  }
}

function queryData() {
  tableApi.query();
}

onMounted(async () => {
  dataFormats.push(...(await getDataFormatList({})));
});

defineExpose({
  queryData,
});
</script>

<template>
  <BiLoading :loading="loading">
    <BasicTable />
  </BiLoading>
</template>
