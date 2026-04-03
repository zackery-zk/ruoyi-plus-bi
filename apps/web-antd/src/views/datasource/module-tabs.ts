import type { ModuleTabModuleDefinition } from '#/components/module-tabbar';

import { TabModuleKey } from '@vben/constants';

import SourceForm from './components/source-form.vue';
import SourceHome from './components/source-home.vue';
import { TableInfo } from './components/table-info';

export enum ModuleTableComponentEnum {
  SOURCE_FORM = 'source-form',
  SOURCE_HOME = 'source-home',
  TABLE_STRUCTURE = 'table-structure',
}

const datasourceModuleDefinition: ModuleTabModuleDefinition = {
  components: [
    {
      component: SourceForm,
      description: '数据源表单',
      key: ModuleTableComponentEnum.SOURCE_FORM,
      title: '数据源表单',
    },
    {
      component: TableInfo,
      description: '表详情',
      key: ModuleTableComponentEnum.TABLE_STRUCTURE,
      title: '表详情',
    },
    {
      component: SourceHome,
      description: '默认',
      key: ModuleTableComponentEnum.SOURCE_HOME,
      title: '导航',
    },
  ],
  defaultTabs: [
    {
      componentKey: ModuleTableComponentEnum.SOURCE_HOME,
      title: '导航',
    },
  ],
  key: TabModuleKey.DATASOURCE,
  title: '数据源模块',
};

export { datasourceModuleDefinition };
