<script setup lang="ts">
import type { ParamInfo } from '#/api/core/param';
import type { OutputFieldInfo } from '#/api/core/result';
import type { SqlDatasetForm } from '#/api/dataservice/sql-dataset/model';

import { reactive, ref } from 'vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { queryRawData } from '#/api/dataservice/sql-dataset';
import { BiLoading } from '#/components/bi-loading';

const sqlDatasetForm = defineModel<SqlDatasetForm>('sqlDatasetForm', {
  required: true,
});
const basicTableRef = ref();
const loading = ref<boolean>(false);
const paramsInfo = ref<ParamInfo[]>([]);
const outFields = ref<OutputFieldInfo[]>([]);
const gridOptions: VxeGridProps = reactive({
  checkboxConfig: {
    highlight: true,
    reserve: true,
    trigger: 'row',
  },
  rowConfig: {
    keyField: 'rowId-raw-data',
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
      query: async ({ page }) => {
        if (sqlDatasetForm.value.dsId && sqlDatasetForm.value.sqlContent) {
          loading.value = true;
          try {
            const result = await queryRawData({
              dsId: sqlDatasetForm.value.dsId,
              sqlContent: sqlDatasetForm.value.sqlContent,
              pageNo: page.currentPage,
              pageSize: page.pageSize,
              totalRows: true,
              params: paramsInfo.value,
              outFields: outFields.value,
            });
            const width = getColumnWidth(result.columns.length);
            const columns = result.columns.map((v) => {
              return {
                field: v.name,
                title: v.alias || v.name,
                width: width,
              };
            });
            tableApi.grid.loadColumn(columns);

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
      },
    },
  },
  toolbarConfig: { enabled: true },
  id: `sql-dataset-form-raw-data`,
  data: [],
});
const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});

function queryData(params: ParamInfo[], fields: OutputFieldInfo[]) {
  paramsInfo.value = params;
  outFields.value = fields;
  tableApi.query();
}

defineExpose({
  queryData,
});

function getColumnWidth(size: number) {
  const fixedWidth = 150;
  const el = (basicTableRef.value?.$el ?? undefined) as HTMLElement | undefined;
  const width = el?.getBoundingClientRect?.().width ?? 0;

  // 按每列固定 150px 判断：容器能放下 size 列则用 auto，否则固定 150（触发横向滚动/截断逻辑由表格处理）
  const canFit = width >= size * fixedWidth;
  return canFit ? undefined : fixedWidth;
}
</script>

<template>
  <BiLoading :loading="loading">
    <BasicTable ref="basicTableRef" />
  </BiLoading>
</template>
