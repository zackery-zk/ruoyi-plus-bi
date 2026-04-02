import type { ModuleTabModuleDefinition } from '#/components/module-tabbar';

import ServiceDebugger from './components/service-debugger.vue';
import ServiceOverview from './components/service-overview.vue';

const dataserviceModuleDefinition: ModuleTabModuleDefinition = {
  components: [
    {
      component: ServiceOverview,
      description: '数据服务模块默认页',
      key: 'service-overview',
      title: '数据服务总览',
    },
    {
      component: ServiceDebugger,
      description: '数据服务调试页',
      key: 'service-debugger',
      title: '数据服务调试',
    },
  ],
  defaultTabs: [
    {
      componentKey: 'service-overview',
      params: {
        scene: 'default',
      },
      title: '导航',
    },
  ],
  key: 'dataservice',
  title: '数据服务模块',
};

export { dataserviceModuleDefinition };
