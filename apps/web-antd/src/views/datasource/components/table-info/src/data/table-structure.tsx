import type { VxeGridProps } from '#/adapter/vxe-table';

import { dataFormatConvert, dataTypeOptions } from '@vben/constants';

import { Input, Select } from 'antdv-next';

// 需要使用i18n注意这里要改成getter形式 否则切换语言不会刷新
export const vxeTableColumns: (
  dataFormatMaps: any,
) => VxeGridProps['columns'] = (dataFormatMaps: any) => [
  {
    title: '字段名称',
    field: 'fieldName',
    minWidth: 160,
  },
  {
    title: '字段别名',
    field: 'fieldAlias',
    minWidth: 160,
    slots: {
      edit: ({ row }) => {
        return <Input v-model:value={row.fieldAlias}></Input>;
      },
    },
    editRender: {},
  },
  {
    title: '数据类型',
    field: 'dataType',
    minWidth: 160,
    editRender: {},
    slots: {
      default: ({ row }) => {
        const dataType = row.dataType;
        const found = dataTypeOptions.find((item) => item.value === dataType);
        if (found) {
          return found.label;
        }
        return dataType;
      },
      edit: ({ row }) => {
        return (
          <Select
            options={dataTypeOptions}
            v-model:value={row.dataType}
          ></Select>
        );
      },
    },
  },
  {
    title: '数据格式',
    field: 'dataFormat',
    minWidth: 160,
    slots: {
      default: ({ row }) => {
        const dataType = row.dataType;
        const dataFormat = row.dataFormat;
        const options =
          dataFormatMaps[dataFormatConvert(dataType)]?.map((item: any) => ({
            label: item.formatName,
            value: item.formatId,
          })) ?? [];

        const found = options.find((item: any) => item.value === dataFormat);
        if (found) {
          return found.label;
        }
        return dataFormat;
      },
      edit: ({ row }) => {
        const dataType = row.dataType;
        const options =
          dataFormatMaps[dataFormatConvert(dataType)]?.map((item: any) => ({
            label: item.formatName,
            value: item.formatId,
          })) ?? [];
        return (
          <Select options={options} v-model:value={row.dataFormat}></Select>
        );
      },
    },
    editRender: {},
  },
  {
    title: '字段描述',
    field: 'fieldDesc',
    minWidth: 160,
    slots: {
      edit: ({ row }) => {
        return <Input v-model:value={row.fieldDesc}></Input>;
      },
    },
    editRender: {},
  },
];
