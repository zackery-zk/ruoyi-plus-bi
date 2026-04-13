<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';
import type {
  SqlDatasetForm,
  SqlDataSetParam,
} from '#/api/dataservice/sql-dataset/model';
import type { BasicTable } from '#/api/datasource/table/model';

import { ref } from 'vue';

import { ParamDataTypeEnum } from '@vben/constants';

import { message } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { BiLoading } from '#/components/bi-loading';
import { parseSqlParams } from '#/utils/parameter';

import { vxeParamsTableColumns } from './data';

const sqlDatasetForm = defineModel<SqlDatasetForm>('sqlDatasetForm', {
  required: true,
});
const loading = ref<boolean>(false);
const gridOptions: VxeGridProps = {
  checkboxConfig: {
    highlight: true,
    reserve: true,
    trigger: 'row',
  },
  size: 'small',
  editConfig: { trigger: 'click', mode: 'cell', showStatus: true },
  border: true,
  columns: vxeParamsTableColumns(),
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    autoLoad: false,
    enabled: false,
  },
  rowConfig: {
    keyField: 'paramName',
  },
  id: 'sql-data-set-params-table',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});

async function getGridData() {
  return await tableApi?.grid?.getData?.();
}
async function queryData() {
  loading.value = true;
  if (!sqlDatasetForm.value) return;

  const parsedParams = parseSqlParams(sqlDatasetForm.value.sqlContent || '');

  const oldParams = await tableApi.grid.getFullData();
  // 将解析出的参数添加到 outParams 中，保留已有参数的值
  parsedParams.forEach(async (param) => {
    const existingParam = oldParams.find(
      (p) => p.paramName === param.paramName,
    );
    if (existingParam) {
      // 更新必填状态
      existingParam.required = param.required;
    } else {
      if (param.paramName) {
        const newParam: SqlDataSetParam = {
          paramName: param.paramName,
          paramAlias: '',
          dataType: ParamDataTypeEnum.STRING,
          defaultValue: '',
          required: param.required,
        };
        oldParams.push(newParam);
      }
    }
  });

  tableApi.grid.clearAll();
  tableApi.grid.loadData(oldParams);
  setTimeout(() => {
    loading.value = false;
  }, 200);
}

// 校验参数是否合法
const verifySqlParam = () => {
  if (!sqlDatasetForm.value.sqlContent) {
    return false;
  }
  const oldParams = tableApi.grid.getFullData();
  // 检测必填参数默认值是否设置
  for (const param of oldParams || []) {
    if (
      param.required &&
      (!param.defaultValue || param.defaultValue === '[]')
    ) {
      tableApi.grid.setEditCell(param, 'defaultValue');

      message.warning(`${param.paramName}是必填参数必须设置默认值`);
      return false;
    }
  }
  return true;
};

const loadData = (param: any) => {
  tableApi.grid.loadData(param);
};

defineExpose({
  getGridData,
  queryData,
  verifySqlParam,
  loadData,
});
</script>

<template>
  <BiLoading :loading="loading">
    <BasicTable />
  </BiLoading>
</template>
