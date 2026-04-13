<script setup lang="ts">

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DataFormatVO } from '#/api/basic/model';
import type { SqlDatasetForm } from '#/api/dataservice/sql-dataset/model';
import type { BasicTable } from '#/api/datasource/table/model';

import { onMounted, reactive, ref } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDataFormatList } from '#/api/basic';
import { detectOutfields } from '#/api/dataservice/sql-dataset';
import { BiLoading } from '#/components/bi-loading';

import { vxeTableColumns } from './data';

const sqlDatasetForm = defineModel<SqlDatasetForm>('sqlDatasetForm', {
  required: true,
});
const loading = ref<boolean>(false);
const dataFormats = reactive<DataFormatVO[]>([]);

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    highlight: true,
    reserve: true,
    trigger: 'row',
  },
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
      query: async () => {
        return sqlDatasetForm.value.dsId && sqlDatasetForm.value.sqlContent
          ? await detectOutfields(
              sqlDatasetForm.value.dsId,
              sqlDatasetForm.value.sqlContent,
            )
          : [];
      },
    },
  },
  rowConfig: {
    keyField: 'fieldId_table_id',
  },
  id: 'field-info-index',
};
const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});

async function getGridData() {
  return await tableApi?.grid?.getData?.();
}
function queryData() {
  loading.value= true;
  tableApi?.query();
  setTimeout(()=>{
    loading.value = false;
  },200)
}

const loadData = (fields: any) => {
  tableApi.grid.reloadData(fields);
};



onMounted(async () => {
  dataFormats.push(...(await getDataFormatList({})));
});



defineExpose({
  getGridData,
  queryData,
  loadData,
});
</script>

<template>
  <BiLoading :loading="loading">
    <BasicTable />
  </BiLoading>
</template>
