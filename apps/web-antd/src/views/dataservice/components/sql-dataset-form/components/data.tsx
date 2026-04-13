import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DataFormatVO } from '#/api/basic/model';

import {
  dataFormatConvert,
  dataTypeOptions,
  getDefaultFormat,
  paramDataTypeOption,
} from '@vben/constants';

import { Input, Select } from 'antdv-next';

// 需要使用i18n注意这里要改成getter形式 否则切换语言不会刷新
export const vxeTableColumns: (
  dataFormats: DataFormatVO[],
) => VxeGridProps['columns'] = (dataFormats: DataFormatVO[]) => [
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
        console.log(dataType);
        return dataType;
      },
      edit: ({ row }) => {
        const dataTypeChange = () => {
          row.dataFormat = getDefaultFormat(row.dataType);
        };

        return (
          <Select
            onChange={dataTypeChange}
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
        const dataFormat = row.dataFormat;

        const options =
          dataFormats
            .filter((item) => item.dataType === dataFormatConvert(row.dataType))
            .map((item: any) => ({
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
        const options =
          dataFormats
            .filter((item) => item.dataType === dataFormatConvert(row.dataType))
            .map((item: any) => ({
              label: item.formatName,
              value: item.formatId,
            })) ?? [];
            console.log(options);
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

// 需要使用i18n注意这里要改成getter形式 否则切换语言不会刷新
export const vxeParamsTableColumns: () => VxeGridProps['columns'] = () => [
  {
    title: '名称',
    field: 'paramName',
  },
  {
    title: '别名',
    field: 'paramAlias',
    slots: {
      edit: ({ row }) => {
        return <Input v-model:value={row.paramAlias}></Input>;
      },
    },
    editRender: {},
  },
  {
    title: '数据类型',
    field: 'dataType',
    editRender: {},
    slots: {
      default: ({ row }) => {
        const dataType = row.dataType;
        const found = paramDataTypeOption.find(
          (item) => item.value === dataType,
        );
        if (found) {
          return found.label;
        }
        return dataType;
      },
      edit: ({ row }) => {
        return (
          <Select
            options={paramDataTypeOption}
            v-model:value={row.javaType}
          ></Select>
        );
      },
    },
  },
  {
    title: '默认值',
    field: 'defaultValue',
    slots: {
      edit: ({ row }) => {
        return <Input v-model:value={row.defaultValue}></Input>;
      },
    },
    editRender: {},
  },
  {
    title: '是否必填',
    field: 'required',
    slots: {
      edit: ({ row }) => {
        return <Input v-model:value={row.required}></Input>;
      },
    },
    editRender: {},
  },
];
