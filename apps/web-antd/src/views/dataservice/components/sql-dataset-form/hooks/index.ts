import type {
  DatasetConfig,
  SqlDatasetForm,
} from '#/api/dataservice/sql-dataset/model';
import type { BasicTable } from '#/api/datasource/table/model';

import { ref } from 'vue';

import { message } from 'antdv-next';

import { getAllTableByDsId } from '#/api/datasource';
import { SQLMonacoEditor } from '#/components/sql-monaco-editor';

import DatasetOutfields from '../components/dataset-outfields.vue';
import DatasetParams from '../components/dataset-params.vue';
import DatasetRawData from '../components/dataset-raw-data.vue';
export function useSqlDataset() {
  const sqlDatasetForm = ref<SqlDatasetForm>(createFormModel());
  const datasetConfig = ref<DatasetConfig>({
    cacheEnable: false,
    cacheTime: 8,
    cacheTimeUnit: 'hour',
  });
  const sqlMonacoEditorRef = ref<InstanceType<typeof SQLMonacoEditor>>();

  const datasetRawDataRef = ref<InstanceType<typeof DatasetRawData>>();

  const datasetOutfieldsRef = ref<InstanceType<typeof DatasetOutfields>>();

  const datasetParamsRef = ref<InstanceType<typeof DatasetParams>>();
  /** 资源树加载状态 */
  const treeLoading = ref<boolean>(false);

  /** 编辑器提示数据 */
  const editorPromptData = ref<BasicTable[]>([]);

  /** 获取编辑器提示数据 */
  async function getEditorPromptData() {
    if (sqlDatasetForm.value.dsId) {
      editorPromptData.value = await getAllTableByDsId(
        sqlDatasetForm.value.dsId,
      );
    }
  }

  function verifyForm() {
    if (!sqlDatasetForm.value.dsId || !sqlDatasetForm.value.sqlContent) {
      message.warning('请选择数据源和SQL语句');
      return false;
    }
    return true;
  }
  function verifyParams() {
    if (!datasetParamsRef.value?.verifySqlParam()) {
      return false;
    }
    return true;
  }

  // 初始化表单数据
  function createFormModel(): SqlDatasetForm {
    return {
      dsId: '',
      datasetName: '',
      datasetAlias: '',
      datasetDesc: '',
      datasetFields: [],
      datasetParam: [],
    };
  }
  return {
    sqlMonacoEditorRef,
    datasetRawDataRef,
    datasetOutfieldsRef,
    datasetParamsRef,
    datasetConfig,
    editorPromptData,
    treeLoading,
    sqlDatasetForm,

    getEditorPromptData,
    verifyForm,
    verifyParams,
  };
}
