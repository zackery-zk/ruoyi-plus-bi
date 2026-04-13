<script lang="ts" setup>
import type { ID } from '#/api/common';
import type { ParamInfo } from '#/api/core/param';
import type { ResourceVO } from '#/api/resource/model';
import type { ModuleTabItem } from '#/components/module-tabbar';

import { h, nextTick, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import {
  ModuleTypeEnum,
  ResourceTypeEnum,
  TabEventTypeEnum,
  TabModuleKey,
} from '@vben/constants';

import { ReloadOutlined } from '@antdv-next/icons';
import { message } from 'antdv-next';
import { cloneDeep } from 'lodash-es';

import {
  createSqlDataSet,
  getSqlDatasetInfo,
  updateSqlDataSet,
} from '#/api/dataservice/sql-dataset';
import { getResourceById } from '#/api/resource';
import { BiCardPanel } from '#/components/bi-card-panel';
import { SQLMonacoEditor } from '#/components/sql-monaco-editor';
import { useModuleTabbarStore } from '#/store';
import saveResourceModel from '#/views/resource/save-resource-model.vue';
import selectResourceTreeModal from '#/views/resource/select-resource-tree-model.vue';

import DatasetOutfields from './components/dataset-outfields.vue';
import DatasetParams from './components/dataset-params.vue';
import DatasetRawData from './components/dataset-raw-data.vue';
import DatasetSetting from './components/dataset-setting.vue';
import DatasourceTree from './components/datasource-tree.vue';
import { useSqlDataset } from './hooks';

interface Props {
  tab: ModuleTabItem;
  params: Params;
}
interface Params {
  resId?: ID;
}
const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'tabEvent', params: any): void;
}>();

const panelLoading = ref<boolean>(false);
const loading = ref<boolean>(false);
const isUpdate = ref<boolean>(false);
const activeTab = ref<string>('params');
const tabItems: any[] = [
  {
    label: '参数信息',
    value: 'params',
  },
  {
    label: '预览数据',
    value: 'previewData',
  },
  {
    label: '输出字段',
    value: 'out_fields',
  },
  {
    label: '设置',
    value: 'settings',
  },
];
const moduleTabbarStore = useModuleTabbarStore();
const {
  datasetRawDataRef,
  datasetOutfieldsRef,
  datasetParamsRef,
  sqlMonacoEditorRef,
  datasetConfig,
  sqlDatasetForm,
  editorPromptData,
  getEditorPromptData,
  verifyForm,
  verifyParams,
  treeLoading,
} = useSqlDataset();

const dataSourceOption = ref<any[]>([]);
const [SelectResourceTreeModal, selectResourceTreeApi] = useVbenModal({
  connectedComponent: selectResourceTreeModal,
});

const [SaveResourceModel, saveResourceModelApi] = useVbenModal({
  connectedComponent: saveResourceModel,
});

// 打开选择数据源弹窗
function handleShowDataSourceModal() {
  selectResourceTreeApi.setData({
    module: ModuleTypeEnum.DATA_SOURCE,
    selectType: ResourceTypeEnum.DATA_SOURCE,
  });
  selectResourceTreeApi.open();
}

// 选择数据源回调
function handleSelectResource(nodeData: ResourceVO) {
  sqlDatasetForm.value.dsId = nodeData.resId;
  treeLoading.value = true;
  dataSourceOption.value = [
    {
      label: nodeData.resAlias || nodeData.resName,
      value: nodeData.resId,
    },
  ];
  sqlDatasetForm.value.dsId = nodeData.resId;
  getEditorPromptData();
  setTimeout(() => {
    treeLoading.value = false;
  }, 500);
}

//刷新数据
async function handleRefreshData() {
  if (!verifyForm()) {
    return;
  }
  //先检测参数
  await datasetParamsRef.value?.queryData();
  if (!datasetParamsRef.value?.verifySqlParam()) {
    activeTab.value = 'params';
    return;
  }
  activeTab.value = 'previewData';
  const data = await datasetParamsRef.value?.getGridData();
  const paramsInfo = [] as ParamInfo[];
  for (const item of data) {
    paramsInfo.push({
      paramName: item.paramName,
      paramValue: item.defaultValue,
      dataType: item.dataType,
    });
  }
  const outFields = (await datasetOutfieldsRef.value?.getGridData()) || [];
  datasetRawDataRef.value?.queryData(paramsInfo, outFields);
}

//加载元数据
async function handleCheckOutputFields() {
  if (!verifyForm()) {
    return;
  }
  activeTab.value = 'out_fields';
  datasetOutfieldsRef.value?.queryData();
}

async function handleSaveResource() {
  if (!verifyForm() || !verifyParams()) {
    return;
  }

  if (isUpdate.value) {
    handleSave();
  } else {
    saveResourceModelApi.setData({
      module: ModuleTypeEnum.DATA_SERVICE,
    });
    saveResourceModelApi.open();
    return;
  }
}
async function handleSaveCallback(data: {
  dirId: ID;
  resDesc: string;
  resName: string;
}) {
  sqlDatasetForm.value.datasetName = data.resName;
  sqlDatasetForm.value.datasetDesc = data.resDesc;
  sqlDatasetForm.value.parentId = data.dirId;
  handleSave();
}

async function handleSave() {
  if (!verifyForm() || !verifyParams()) {
    return;
  }
  try {
    loading.value = true;
    const modelData = cloneDeep(sqlDatasetForm.value);
    const fields = (await datasetOutfieldsRef.value?.getGridData()) || [];
    modelData.datasetFields = JSON.stringify(fields);
    const params = (await datasetParamsRef.value?.getGridData()) || [];
    modelData.datasetParam = JSON.stringify(params);
    modelData.datasetConfig = JSON.stringify(datasetConfig.value);

    const data = isUpdate.value
      ? await updateSqlDataSet(modelData)
      : await createSqlDataSet(modelData);
    if (data) {
      message.success('保存成功');
      saveResourceModelApi.close();
      if (isUpdate.value) {
        emits('tabEvent', {
          key: TabEventTypeEnum.NEW_DATASET,
          data: { resId: modelData.parentId },
        });
      } else {
        moduleTabbarStore.updateTabById(
          TabModuleKey.DATA_SERVICE,
          props.tab.id,
          modelData.datasetAlias || modelData.datasetName,
          data,
        );
      }
    }
  } finally {
    loading.value = false;
  }
}

//初始化
async function showFormPanel() {
  panelLoading.value = true;
  loading.value = true;
  isUpdate.value = Boolean(props.params.resId);
  try {
    if (isUpdate.value && props.params.resId) {
      const result = await getSqlDatasetInfo(props.params.resId);
      sqlDatasetForm.value = result;
      const params = JSON.parse(result.datasetParam);
      const fields = JSON.parse(result.datasetFields);

      datasetConfig.value = JSON.parse(result.datasetConfig);
      //获取数据源信息
      const dataSource = await getResourceById(result.dsId);
      dataSourceOption.value = [
        {
          label: dataSource.resAlias || dataSource.resName,
          value: dataSource.resId,
        },
      ];
      getEditorPromptData();
      panelLoading.value = false;
      nextTick(() => {
        datasetOutfieldsRef.value?.loadData(fields);
        if (params && params.length > 0) {
          datasetParamsRef.value?.loadData(params);
        }
      });
    }
  } finally {
    panelLoading.value = false;
    loading.value = false;
  }
}

onMounted(() => {
  showFormPanel();
});
</script>

<template>
  <BiCardPanel :loading="loading" :panel-loading="panelLoading">
    <template #actions>
      <a-flex gap="12" justify="end">
        <a-button :icon="h(ReloadOutlined)" @click="handleCheckOutputFields">
          加载元数据
        </a-button>
        <a-button
          :icon="h(ReloadOutlined)"
          @click="handleRefreshData"
          type="primary"
          :loading="loading"
        >
          刷新数据
        </a-button>
        <a-button>关 闭</a-button>
        <a-button type="primary" :loading="loading" @click="handleSaveResource">
          保 存
        </a-button>
      </a-flex>
    </template>
    <div class="h-full w-full flex">
      <DatasourceTree
        v-model:sql-dataset-form="sqlDatasetForm"
        v-model:tree-loading="treeLoading"
        v-model:data-source-option="dataSourceOption"
        @select-datasource="handleShowDataSourceModal"
      />
      <div
        class="bg-sql-set-content h-full min-w-0 flex flex-col flex-1 border"
      >
        <div class="relative w-full flex-1">
          <SQLMonacoEditor
            ref="sqlMonacoEditorRef"
            v-model:value="sqlDatasetForm.sqlContent"
            language="sql"
            :tree-data="editorPromptData"
          />
        </div>
        <div class="h-[50%] w-full border-t border-border flex flex-col">
          <div class="h-[40px] flex px-2 items-center border-b border-border">
            <a-segmented :options="tabItems" v-model:value="activeTab" />
          </div>
          <div class="flex-1 w-full h-0">
            <DatasetRawData
              v-show="activeTab === 'previewData'"
              v-model:sql-dataset-form="sqlDatasetForm"
              ref="datasetRawDataRef"
            />
            <DatasetSetting
              v-show="activeTab === 'settings'"
              v-model:dataset-config="datasetConfig"
            />
            <DatasetOutfields
              v-show="activeTab === 'out_fields'"
              v-model:sql-dataset-form="sqlDatasetForm"
              ref="datasetOutfieldsRef"
            />
            <DatasetParams
              ref="datasetParamsRef"
              v-show="activeTab === 'params'"
              v-model:sql-dataset-form="sqlDatasetForm"
            />
          </div>
        </div>
      </div>
    </div>
    <SelectResourceTreeModal @select="handleSelectResource" />

    <SaveResourceModel @save="handleSaveCallback" />
  </BiCardPanel>
</template>
