<script lang="ts" setup>
import type { ID } from '#/api/common';
import type { DatasourceForm } from '#/api/datasource/model';
import type { ModuleTabItem } from '#/components/module-tabbar';

import { onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import {
  AUTH_TYPE_OPTION,
  AuthTypeEnum,
  COLUMN_ALIAS_SOURCE_OPTION,
  DATA_SOURCE_CHARTSET_OPTION,
  DataBaseTypeEnum,
  ModuleTypeEnum,
  TabModuleKey,
  TRANSACTION_ISOLATION_LEVEL_OPTION,
  VALIDATE_STATEMENT_TYPE_OPTION,
} from '@vben/constants';

import { message } from 'antdv-next';
import { cloneDeep } from 'lodash-es';

import {
  createDatasource,
  getDataSource,
  testConnection,
  updateDatasource,
} from '#/api/datasource';
import { BiCardPanel } from '#/components/bi-card-panel';
import { useModuleTabbarStore } from '#/store';
import saveResourceModel from '#/views/resource/save-resource-model.vue';

import {
  type DataBaseType,
  getCategoryByType,
  getDataBaseTypeByType,
} from '../data/datasource-lib';

interface Props {
  tab: ModuleTabItem;
  params: Params;
}
interface Params {
  dsId?: ID;
  type?: DataBaseTypeEnum;
}
interface PoolConfig {
  maxConn: number;
  minIdle: number;
  idleTimeout: number;
  connTimeout: number;
  poolAttribute: string;
}

const props = defineProps<Props>();
const panelLoading = ref<boolean>(false);
const loading = ref<boolean>(false);
const isUpdate = ref<boolean>(false);
const model = ref<DatasourceForm>(createFormModel());
const dataSourceTypeOptions = ref<DataBaseType[]>([]);
const poolConfig = ref<PoolConfig>(createFormPoolConfig());
const formRef = ref();
const moduleTabbarStore = useModuleTabbarStore();
const [SaveResourceModel, saveResourceModelApi] = useVbenModal({
  connectedComponent: saveResourceModel,
});

function createFormModel(): DatasourceForm {
  return {
    authType: AuthTypeEnum.PASSWORD,
    autoCommit: '1',
    characterSet: 'utf8',
    poolConfig: '',
    isolation: 'JDBC',
    columnAliasSource: '',
    valMethod: 'GET_CONNECTION',
    valQuery: 'SELECT 1',
    quotedIden: '`',
  };
}
function createFormPoolConfig(): PoolConfig {
  return {
    maxConn: 20,
    minIdle: 5,
    idleTimeout: 600_000,
    connTimeout: 30_000,
    poolAttribute: '',
  };
}

// 数据源类型改变事件
function handleChangeDataSourceType(value: string) {
  const driverData = getDataBaseTypeByType(
    value as unknown as DataBaseTypeEnum,
  );
  model.value.driverClass = driverData?.driverClass;
  model.value.datasrcUrl = driverData?.driverUrl;
}

// 测试连接
async function testConnDataBase() {
  try {
    loading.value = true;
    await formRef.value?.validate();
    const modelData = cloneDeep(model.value);
    if (modelData.authType === AuthTypeEnum.PASSWORD && modelData.datasrcPwd) {
      modelData.datasrcPwd = window.btoa(modelData.datasrcPwd);
    }
    const data = await testConnection(modelData);
    if (data) {
      message.success('测试连接成功');
    } else {
      message.error('测试连接失败');
    }
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 200);
  }
}

async function handleSaveResource() {
  await formRef.value?.validate();
  if (isUpdate.value) {
    handleSave();
  } else {
    saveResourceModelApi.setData({
      module: ModuleTypeEnum.DATA_SOURCE,
    });
    saveResourceModelApi.open();
    return;
  }
}

async function handleSave() {
  try {
    loading.value = true;
    const modelData = cloneDeep(model.value);
    if (modelData.authType === AuthTypeEnum.PASSWORD && modelData.datasrcPwd) {
      modelData.datasrcPwd = window.btoa(modelData.datasrcPwd);
    }

    const data = isUpdate.value
      ? await updateDatasource(modelData)
      : await createDatasource(modelData);
    if (data) {
      message.success('保存成功');
      saveResourceModelApi.close();
      if (!isUpdate.value) {
        moduleTabbarStore.updateTabById(
          TabModuleKey.DATASOURCE,
          props.tab.id,
          modelData.datasrcAlias || modelData.datasrcName,
          data,
        );
      }
    }
  } finally {
    loading.value = false;
  }
}

async function handleSaveCallback(data: {
  dirId: ID;
  resDesc: string;
  resName: string;
}) {
  model.value.datasrcName = data.resName;
  model.value.datasrcDesc = data.resDesc;
  model.value.parentId = data.dirId;
  handleSave();
}

async function showFormPanel(data: Params) {
  // 判断是否为修改
  panelLoading.value = true;
  isUpdate.value = Boolean(data.dsId);
  if (isUpdate.value && data.dsId) {
    const result = await getDataSource(data.dsId);
    result.datasrcPwd = window.atob(result.datasrcPwd);
    model.value = result;
  } else {
    model.value.datasrcType = data.type ?? DataBaseTypeEnum.MySql;
    // 获取驱动信息
    const driverData = getDataBaseTypeByType(
      model.value.datasrcType as DataBaseTypeEnum,
    );
    model.value.driverClass = driverData?.driverClass;
    model.value.datasrcUrl = driverData?.driverUrl;
  }
  // 获取数据源类型备选值
  if (model.value.datasrcType) {
    dataSourceTypeOptions.value =
      getCategoryByType(model.value.datasrcType as DataBaseTypeEnum)
        ?.children || [];
  }
  setTimeout(() => {
    panelLoading.value = false;
  }, 200);
}

onMounted(() => {
  showFormPanel(props.params);
});
</script>

<template>
  <BiCardPanel :loading="loading" :panel-loading="panelLoading">
    <a-form
      ref="formRef"
      label-placement="left"
      :model="model"
      :label-col="{ span: 5 }"
    >
      <div
        class="bg-[hsl(var(--primary-50))] w-full p-3 mb-2 rounded-md font-bold"
      >
        基础设置
      </div>
      <div class="max-w-[700px]">
        <a-form-item
          label="类型"
          required
          name="datasrcType"
          :rules="[{ required: true }]"
        >
          <a-select
            v-model:value="model.datasrcType"
            :options="
              dataSourceTypeOptions.map((item) => ({
                label: item.name,
                value: item.type,
              }))
            "
            @change="handleChangeDataSourceType"
          />
        </a-form-item>
        <a-form-item
          label="驱动类"
          required
          name="driverClass"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="model.driverClass" />
        </a-form-item>
        <a-form-item
          label="URL"
          required
          name="datasrcUrl"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="model.datasrcUrl" />
        </a-form-item>
        <a-form-item
          label="认证类型"
          required
          name="authType"
          :rules="[{ required: true }]"
        >
          <a-select
            v-model:value="model.authType"
            :options="AUTH_TYPE_OPTION"
          />
        </a-form-item>
        <a-form-item
          v-if="model.authType === AuthTypeEnum.PASSWORD"
          label="用户名"
          required
          name="datasrcUser"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="model.datasrcUser" />
        </a-form-item>
        <a-form-item
          v-if="model.authType === AuthTypeEnum.PASSWORD"
          label="密码"
        >
          <a-input v-model:value="model.datasrcPwd" type="password" />
        </a-form-item>
      </div>

      <div
        class="bg-[hsl(var(--primary-50))] w-full p-3 mb-2 rounded-md font-bold"
      >
        连接池参数
      </div>
      <div class="max-w-[700px]">
        <a-form-item label="最大连接数">
          <a-input-number
            v-model:value="poolConfig.maxConn"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="空闲时间">
          <a-input-number
            v-model:value="poolConfig.idleTimeout"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="最小空闲连接数">
          <a-input-number
            v-model:value="poolConfig.minIdle"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="超时时间">
          <a-input-number
            v-model:value="poolConfig.connTimeout"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="其他配置">
          <a-textarea
            v-model:value="poolConfig.poolAttribute"
            type="textarea"
            :rows="3"
            placeholder="key=value;key2=value2;"
          />
        </a-form-item>
      </div>

      <div
        class="bg-[hsl(var(--primary-50))] w-full p-3 mb-2 rounded-md font-bold"
      >
        高级设置
      </div>
      <div class="max-w-[700px]">
        <a-form-item label="数据源字符集">
          <a-select
            v-model:value="model.characterSet"
            :options="DATA_SOURCE_CHARTSET_OPTION"
          />
        </a-form-item>
        <a-form-item label="事务隔离级别">
          <a-flex align="center" gap="10">
            <a-select
              v-model:value="model.isolation"
              :options="TRANSACTION_ISOLATION_LEVEL_OPTION"
            />
            <a-tooltip trigger="hover">
              <template #title>
                <span>是否开启自动事务</span>
              </template>
              <a-switch
                v-model:checked="model.autoCommit"
                checked-value="1"
                unchecked-value="0"
              />
            </a-tooltip>
          </a-flex>
        </a-form-item>
        <a-form-item label="列别名来源">
          <a-select
            v-model:value="model.columnAliasSource"
            :options="COLUMN_ALIAS_SOURCE_OPTION"
          />
        </a-form-item>
        <a-form-item label="校验语句">
          <div class="w-[50%]">
            <a-select
              v-model:value="model.valMethod"
              :options="VALIDATE_STATEMENT_TYPE_OPTION"
            />
          </div>
          <div class="ml-2 w-[50%]">
            <a-input v-model:value="model.valQuery" />
          </div>
        </a-form-item>
        <a-form-item label="引用标识符">
          <a-input v-model:value="model.quotedIden" />
        </a-form-item>
      </div>
    </a-form>
    <SaveResourceModel @save="handleSaveCallback" />
    <template #actions>
      <a-flex gap="12" justify="end">
        <a-button @click="testConnDataBase" :loading="loading">
          测试连接
        </a-button>
        <a-button type="primary" :loading="loading" @click="handleSaveResource">
          保 存
        </a-button>
      </a-flex>
    </template>
  </BiCardPanel>
</template>
