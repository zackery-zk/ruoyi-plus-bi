import type { FormSchemaGetter } from '#/adapter/form';

import { ResourceTypeOptions } from '@vben/constants';

export const modalSchema: FormSchemaGetter = () => [
  {
    label: '资源ID',
    fieldName: 'resId',
    component: 'Input',
    dependencies: {
      show: (values) => !!values.resId,
      disabled: (values) => !!values.resId,
      triggerFields: ['resId'],
    },
  },
  {
    label: '父节点',
    fieldName: 'pName',
    dependencies: {
      show: (values) => !values.resId,
      disabled: true,
      triggerFields: ['resId'],
    },
    component: 'Input',
    rules: 'required',
  },
  {
    label: '名称',
    fieldName: 'resName',
    component: 'Input',
    rules: 'required',
    componentProps: {
      maxLength: 255,
    },
    dependencies: {
      disabled: (values) => values.resId,
      triggerFields: ['resId'],
    },
  },
  {
    label: '别名',
    fieldName: 'resAlias',
    component: 'Input',
    componentProps: {
      maxLength: 255,
    },
  },
  {
    label: '资源类型',
    fieldName: 'resType',
    component: 'Select',
    dependencies: {
      show: (values) => !!values.resId,
      disabled: true,
      triggerFields: ['resId'],
    },
    componentProps: {
      options: ResourceTypeOptions,
      buttonStyle: 'solid',
      optionType: 'button',
    },
    rules: 'required',
  },
  {
    label: '父节点ID',
    fieldName: 'resPid',
    dependencies: {
      show: false,
      disabled: true,
      triggerFields: ['resId'],
    },
    component: 'Input',
    rules: 'required',
  },
  {
    label: '路径',
    fieldName: 'resPath',
    component: 'Input',
    defaultValue: 0,
    dependencies: {
      show: (values) => !!values.resId,
      disabled: true,
      triggerFields: ['resId'],
    },
  },
  {
    label: '排序',
    fieldName: 'resSort',
    component: 'InputNumber',
    defaultValue: 0,
    dependencies: {
      show: false,
      triggerFields: ['resId'],
    },
  },
  {
    label: '描述',
    fieldName: 'resDesc',
    component: 'Textarea',
    componentProps: {
      maxLength: 255,
    },
  },
  {
    label: '创建者',
    fieldName: 'createName',
    component: 'Input',
    dependencies: {
      show: (values) => !!values.resId,
      disabled: true,
      triggerFields: ['resId'],
    },
    componentProps: {
      placeholder: '无',
      maxLength: 255,
    },
  },
  {
    label: '创建时间',
    fieldName: 'createTime',
    component: 'Input',
    dependencies: {
      show: (values) => !!values.resId,
      disabled: true,
      triggerFields: ['resId'],
    },
    componentProps: {
      maxLength: 255,
    },
  },
  {
    label: '最后修改者',
    fieldName: 'updateName',
    component: 'Input',
    dependencies: {
      show: (values) => !!values.resId,
      disabled: true,
      triggerFields: ['resId'],
    },
    componentProps: {
      placeholder: '无',
      maxLength: 255,
    },
  },
  {
    label: '最后修改时间',
    fieldName: 'updateTime',
    component: 'Input',
    dependencies: {
      show: (values) => !!values.resId,
      disabled: true,
      triggerFields: ['resId'],
    },
    componentProps: {
      maxLength: 255,
      placeholder: '无',
    },
  },
];


