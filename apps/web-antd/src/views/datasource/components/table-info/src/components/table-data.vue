<script setup lang="ts">
import type { ID } from '#/api/common';
import type { OutputFieldInfo } from '#/api/core/result';

import { nextTick, onMounted, reactive, ref } from 'vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { getFieldByTableId, queryTableData } from '#/api/datasource';
import { BiLoading } from '#/components/bi-loading';
import { getColumnWidth } from '#/utils/column';
interface Props {
  tableId: ID | undefined;
}
const props = defineProps<Props>();

const loading = ref<boolean>(false);

const fields = ref<OutputFieldInfo[]>([]);

const gridOptions: VxeGridProps = reactive({
  checkboxConfig: {
    highlight: true,
    reserve: true,
    trigger: 'row',
  },
  border: true,
  columns: [],
  height: 'auto',
  keyField: 'rowId',
  keepSource: true,
  pagerConfig: {
    layouts: ['Total'],
  },
  proxyConfig: {
    autoLoad:false,
    ajax: {
      query: async () => {
        if (props.tableId) {
          loading.value = true;
          const result = await queryTableData({
            tableId: props.tableId,
            pageSize: 100,
            outFields: fields.value,
            cache: false,
          });

          setTimeout(() => {
            loading.value = false;
          }, 200);

          return {
            rows: result.rows,
            total: result.total,
          };
        }
      },
    },
  },
  toolbarConfig: { enabled: true },
  id: `sql-data-table-${props.tableId}`,
  data: [],
});
const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});
const basicTableRef = ref();

onMounted(async () => {
  const el = (basicTableRef.value?.$el ?? undefined) as HTMLElement;
  if (props.tableId) {
    const tableFields = await getFieldByTableId(props.tableId);
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
    console.log(fields.value);
    nextTick(()=>{
      tableApi.query();
    })
  }
});
</script>

<template>
  <BiLoading :loading="loading">
    <BasicTable table-title="注：预览数据只展示100条数据" ref="basicTableRef" />
  </BiLoading>
</template>
