import type { ModuleTabModuleDefinition } from '#/components/module-tabbar';

import { TabModuleKey } from '@vben/constants';

import DataServiceHome from './components/dataservice-home.vue';
import {SQLDatasetForm} from './components/sql-dataset-form';
export enum ModuleDataServiceComponentEnum {
  DATA_SERVICE_HOME = 'data_service-home',
  MODEL_DATASET_FORM='model_dataset_form',
  SQL_DATASET_FORM = 'sql_dataset_form'
}


const dataserviceModuleDefinition: ModuleTabModuleDefinition = {
  components: [
    {
      component: DataServiceHome,
      description: '导航',
      key: ModuleDataServiceComponentEnum.DATA_SERVICE_HOME,
      title: '数据服务总览',
    },
    {
      component: SQLDatasetForm,
      description: 'SQL数据集表单',
      key: ModuleDataServiceComponentEnum.SQL_DATASET_FORM,
      title: 'SQL数据集',
    },
  ],
  defaultTabs: [
    {
      componentKey: ModuleDataServiceComponentEnum.DATA_SERVICE_HOME,
      title: '导航',
    },
  ],
  key: TabModuleKey.DATA_SERVICE,
  title: '数据服务模块',
};

export { dataserviceModuleDefinition };
