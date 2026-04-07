<script setup lang="ts">
import type { ID } from '#/api/common';

import { nextTick, onMounted, reactive, ref } from 'vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { queryTableData } from '#/api/datasource';
import { BiLoading } from '#/components/bi-loading';
interface Props {
  tableId: ID | undefined;
}
const props = defineProps<Props>();

const loading = ref<boolean>(false);

const gridOptions: VxeGridProps = reactive({
  checkboxConfig: {
    highlight: true,
    reserve: true,
    trigger: 'row',
  },
  border: true,
  columns: [],
  height: 'auto',
  keyField:'rowId',
  keepSource: true,
  pagerConfig: {
    layouts: ['Total'],
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        if (props.tableId) {
          loading.value = true;
          const result = await queryTableData(props.tableId);
          const columns = result.columns.map((v) => {
            return {
              field: v.name,
              title: v.alias || v.name,
            };
          });
          tableApi.grid.loadColumn(columns);
          setTimeout(()=>{
            loading.value = false;
          }, 200);

          return {
            rows: result.rows,
            total: result.total,
          }
        }
      },
    },
  },
  toolbarConfig: {enabled:true},
  id: `sql-data-table-${props.tableId}`,
  data: [],
});
const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});
const basicTableRef = ref();
function loadData() {}

onMounted(() => {
  loadData();
  nextTick(()=>{
    console.log(basicTableRef.value);
  })
});
</script>

<template>
  <BiLoading :loading="loading">
    <BasicTable table-title="注：预览数据只展示100条数据" ref="basicTableRef" />
  </BiLoading>
</template>
