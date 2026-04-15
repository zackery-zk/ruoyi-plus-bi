import type { RouteRecordRaw } from 'vue-router';

import { $t } from '@vben/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      keepAlive:true,
      hideInMenu: true,
      openInNewWindow: true,
      title: $t('数据模型设计器'),
    },
    name: 'VisionSetDesigner',
    path: '/bi/model/datset',
    component: () =>
      import('#/views/dataservice/components/model-dataset-form/index.vue'),
  },
];

export default routes;
