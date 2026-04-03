<script setup lang="ts">
import type { DataTypeEnum } from '@vben/constants';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { ID } from '#/api/common';
import type { BasicTable } from '#/api/datasource/table/model';

import { onMounted, reactive } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDataFormatList } from '#/api/basic';
import { getFieldByTableId } from '#/api/datasource';
import { vxeTableColumns } from '#/views/datasource/components/table-info/src/data/table-structure';

interface Props {
  tableId: ID | undefined;
}
const props = defineProps<Props>();

const dataFormatMaps = reactive<any>({});

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    highlight: true,
    reserve: true,
    trigger: 'row',
  },
  size: 'small',
  editConfig: { trigger: 'click', mode: 'cell', showStatus: true },
  border: true,
  columns: vxeTableColumns(dataFormatMaps),
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        return props.tableId ? await getFieldByTableId(props.tableId) : [];
      },
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

function getGridData() {
  return tableApi?.grid?.getData?.();
}

onMounted(async () => {
  const dataFormats = await getDataFormatList({});
  dataFormats.forEach((item) => {
    dataFormatMaps[item.dataType as DataTypeEnum] =
      dataFormatMaps[item.dataType as DataTypeEnum] || [];
    dataFormatMaps[item.dataType as DataTypeEnum].push(item);
  });
});

defineExpose({
  getGridData,
});
</script>

<template>
  <BasicTable />
</template>
