import type { ModuleTabModuleDefinition } from '#/components/module-tabbar';

import { TabModuleKey } from '@vben/constants';

import SourceForm from './components/source-form.vue';
import SourceHome from './components/source-home.vue'
import SourceOverview from './components/source-overview.vue';
const datasourceModuleDefinition: ModuleTabModuleDefinition = {
  components: [
    {
      component: SourceOverview,
      description: '数据源模块默认页',
      key: 'source-overview',
      title: '数据源总览',
    },
    {
      component: SourceForm ,
      description: '数据源设计页',
      key: 'source-form',
      title: '数据源设计',
    },
     {
      component: SourceHome,
      description: '默认',
      key: 'source-home',
      title: '导航',
    },
  ],
  defaultTabs: [
    {
      componentKey: 'source-home',
      title: '导航',
    },
  ],
  key: TabModuleKey.DATASOURCE,
  title: '数据源模块',
};

export { datasourceModuleDefinition };
