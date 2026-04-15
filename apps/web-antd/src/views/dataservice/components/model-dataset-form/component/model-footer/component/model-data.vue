<script setup lang="ts">
import type { OutputFieldInfo, QueryResult } from '#/api/core/result';

import { nextTick, reactive, ref } from 'vue';

import { ModelNodeTypeEnum } from '@vben/constants';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { queryTableData } from '#/api/datasource';
import { BiLoading } from '#/components/bi-loading';
import { getColumnWidth } from '#/utils/column';

import { useModelDataSetStore } from '../../../store/useModelDataSetStore';

const basicTableRef = ref();
const loading = ref<boolean>(false);
const fields = ref<OutputFieldInfo[]>([]);
const modelDataSetStore = useModelDataSetStore();

const gridOptions: VxeGridProps = reactive({
  checkboxConfig: {
    highlight: true,
    reserve: true,
    trigger: 'row',
  },
  class:'!p-0',
  size:'small',
  rowConfig: {
    keyField: 'rowId',
  },
  border: true,
  columns: [],
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: loadViewData,
    },
  },
  toolbarConfig: { enabled: true },
  id: `model-dataset-preview-data`,
  data: [],
});
const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});

async function loadViewData({ page }: any) {
  loading.value = true;
  try {
    const modelNode = modelDataSetStore.getSelectedModelNode();
    if (!modelNode) {
      return {
        rows: [],
        total: 0,
      };
    }
    let result = {} as QueryResult;
    if (modelNode.nodeType === ModelNodeTypeEnum.TABLE) {
      result = await queryTableData({
        dsId: modelNode.dsId,
        tableId: modelNode.refResId,
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        totalRows: true,
        outFields: fields.value,
      });
    }

    return {
      rows: result.rows,
      total: result.total,
    };
  } catch {
    return {
      rows: [],
      total: 0,
    };
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 200);
  }
}

function queryData() {
  const el = (basicTableRef.value?.$el ?? undefined) as HTMLElement;
  const modelNode = modelDataSetStore.getSelectedModelNode();
  if (modelNode) {
    const tableFields = modelNode.nodeFields;
    const width = getColumnWidth(tableFields.length, el);
    const columns = tableFields.map((v) => {
      return {
        field: v.fieldName,
        title: v.fieldAlias || v.fieldName,
        width,
      };
    });
    tableApi.grid.loadColumn(columns);
    fields.value = tableFields.map((f) => {
      return {
        fieldName: f.fieldName,
        fieldAlias: f.fieldAlias,
        dataType: f.dataType,
        dataFormat: f.dataFormat,
      } as OutputFieldInfo;
    });
    tableApi.grid.loadColumn(columns);
    nextTick(() => {
      tableApi.query();
    });
  }
}

defineExpose({
  queryData,
});
</script>

<template>
  <BiLoading :loading="loading">
    <BasicTable ref="basicTableRef" />
  </BiLoading>
</template>
