<script setup lang="ts">
import type { ID } from '#/api/common';
import type { DatasourceVO } from '#/api/datasource/model';
import type { CatalogInfo, JdbcTable, SchemaInfo } from '#/api/metadata/model';

import { h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DataBaseCategoryEnum, type DataBaseTypeEnum } from '@vben/constants';
import { cloneDeep } from '@vben/utils';

import {
  FastBackwardOutlined,
  FastForwardOutlined,
  SearchOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  TableOutlined,
} from '@antdv-next/icons';
import { Modal } from 'antdv-next';

import {
  getDataSource,
  getSelectedTables,
  updateSelectedTables,
} from '#/api/datasource';
import {
  getAllJdbcCatalog,
  getAllJdbcSchema,
  getAllJdbcTable,
  getConnectionInfo,
} from '#/api/metadata';

import { getCategoryByType } from '../data/datasource-lib';

const emits = defineEmits<{
  reload: [dsId: ID];
}>();
// 通过JDBC获取的所有的schema信息
const schemasInfo = ref<SchemaInfo[]>([]);
// 通过JDBC获取的所有的catalog信息
const catalogsInfo = ref<CatalogInfo[]>([]);

// 当前选中的信息
const selectObject = ref<{
  catalog: string;
  schema: string;
  tables: string[];
}>({
  catalog: '',
  schema: '',
  tables: [],
});

// 搜索文本
const searchTextObj = ref<{
  selectText: string;
  unSelectText: string;
}>({
  selectText: '',
  unSelectText: '',
});

// 当前数据源信息
const dataSource = ref<DatasourceVO>();

// 当前数据源的类型
const categoryTypeEnum = ref<DataBaseCategoryEnum>();

// 当前数据库链接的信息
// 未选中的表
const unTables = ref<JdbcTable[]>([]);
const tables = ref<JdbcTable[]>([]);

const selectTable = ref<JdbcTable>();
const unSelectTable = ref<JdbcTable>();

const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      tables.value = [];
      unTables.value = [];
      schemasInfo.value = [];
      selectTable.value = undefined;
      unSelectTable.value = undefined;
      selectObject.value = {
        catalog: '',
        schema: '',
        tables: [],
      };

      return null;
    }
    modalApi.modalLoading(true);
    const { resId } = modalApi.getData() as {
      resId: number | string;
    };
    try {
      // 获取当前数据源信息
      dataSource.value = await getDataSource(resId);
      if (dataSource.value) {
        categoryTypeEnum.value = getCategoryByType(
          dataSource.value.datasrcType as DataBaseTypeEnum,
        )?.name;
        // 获取当前选中的表
        const tableList = await getSelectedTables(dataSource.value.datasrcId);
        tables.value = tableList.map((v) => {
          return {
            tableName: v.tableName,
            tableAlias: v.tableAlias,
            tableType: v.tableType,
            schema: v.schemaName,
          } as JdbcTable;
        });
        // 如果是嵌入式数据源就不需要获取连接信息了 也不需要获取schema和catalog
        if (categoryTypeEnum.value === DataBaseCategoryEnum.Relational) {
          // 获取当前数据源连接信息
          const connectionInfo = await getConnectionInfo(resId);
          // 先获取catalog
          await queryCatalogList();

          // 判断catalog是否为空 如果为空则不需要按照catalog查询schema 说明conn里catalog也是空的，直接获取全部即可
          if (catalogsInfo.value.length === 0) {
            await queryJdbcSchema();
          }
          // 设置默认schema
          selectObject.value.schema = connectionInfo.schema.name;

          if (connectionInfo.catalog && connectionInfo.catalog.name) {
            selectObject.value.catalog = connectionInfo.catalog.name;
          }

        }
        await queryAllTable();
      }
    } finally {
      modalApi.modalLoading(false);
    }
  },
});

async function queryCatalogList() {
  if (dataSource.value) {
    catalogsInfo.value = await getAllJdbcCatalog(dataSource.value.datasrcId);
  }
}

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    if (dataSource.value) {
      await updateSelectedTables(dataSource.value.datasrcId, tables.value);
    }
    await handleCancel();
    emits('reload', dataSource.value?.datasrcId);
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  modalApi.close();
}

async function handleChangeSchema() {
  await queryAllTable();
}

async function queryJdbcSchema() {
  modalApi.modalLoading(true);
  try {
    if (dataSource.value) {
      schemasInfo.value = await getAllJdbcSchema(dataSource.value.datasrcId);
    }
  } finally {
    modalApi.modalLoading(false);
  }
}

async function queryAllTable() {
  modalApi.modalLoading(true);
  try {
    if (dataSource.value) {
      unTables.value = await getAllJdbcTable(
        dataSource.value.datasrcId,
        selectObject.value.catalog,
        selectObject.value.schema,
      );
      unTables.value.forEach(
        (value) =>
          (value.show = tables.value.every(
            (v) => v.tableName !== value.tableName,
          )),
      );
    }
  } finally {
    modalApi.modalLoading(false);
  }
}

// 输入过滤表
function handleFilterTable(type: string) {
  if (type === 'unSelect') {
    unTables.value.forEach((value) => {
      value.filter = !(
        value.tableName.includes(
          searchTextObj.value.unSelectText.toLowerCase(),
        ) ||
        value.tableAlias.includes(
          searchTextObj.value.unSelectText.toLowerCase(),
        )
      );
    });
  } else if (type === 'select') {
    tables.value.forEach((value) => {
      value.filter = !(
        value.tableName.includes(
          searchTextObj.value.selectText.toLowerCase(),
        ) ||
        value.tableAlias.includes(searchTextObj.value.selectText.toLowerCase())
      );
    });
  }
}

// 选择表
function handleSelectTable(table: JdbcTable, index: number) {
  tables.value.push(cloneDeep(table));
  if (unTables.value[index]) {
    unTables.value[index].show = false;
  }
}

// 取消表
function handleUnSelectTable(table: JdbcTable, index: number) {
  tables.value.splice(index, 1);
  unTables.value.forEach((value: JdbcTable) => {
    if (value.tableName === table.tableName) {
      value.show = undefined;
      console.log(value);
    }
  });
}

/**
 * 点击表
 * @param table
 * @param type
 */
function handleClickTable(table: JdbcTable, type: string) {
  if (type === 'unSelect') {
    unSelectTable.value = table;
  } else {
    selectTable.value = table;
  }
}

// 中间操作
function handleOperate(type: string) {
  switch (type) {
    case 'add': {
      if (selectTable.value) {
        tables.value.push(cloneDeep(selectTable.value));
        const index = unTables.value.findIndex(
          (value) => value.tableName === selectTable.value?.tableName,
        );
        if (unTables.value[index]) {
          unTables.value[index].show = false;
        }
      } else {
        Modal.warning({
          content: '请在左边选择要添加的资源！',
          title: '提示',
        });
      }
      break;
    }
    case 'addAll': {
      tables.value = [...tables.value, ...cloneDeep(unTables.value)];
      unTables.value.forEach((v) => {
        v.show = false;
      });
      break;
    }
    case 'del': {
      if (unSelectTable.value) {
        const index = tables.value.findIndex(
          (value) => value.tableName === unSelectTable.value?.tableName,
        );

        tables.value.splice(index, 1);
        unTables.value.forEach((value: JdbcTable) => {
          if (value.tableName === unSelectTable.value?.tableName) {
            value.show = undefined;
          }
        });
      } else {
        Modal.warning({
          content: '请在右边选择要删除的资源！！',
          title: '提示',
        });
      }
      break;
    }
    case 'delAll': {
      tables.value = [];
      unTables.value.forEach((value: JdbcTable) => {
        value.show = undefined;
      });
      break;
    }
  }
  selectTable.value = undefined;
  unSelectTable.value = undefined;
}
</script>

<template>
  <BasicModal
    :close-on-click-modal="false"
    title="添加表映射"
    class="h-full w-[50%]"
    draggable
  >
    <div class="flex h-full w-full flex-col">
      <div v-if="categoryTypeEnum === DataBaseCategoryEnum.Relational">
        <a-form>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="模式（Catalog）">
                <a-select
                  v-model:value="selectObject.catalog"
                  show-search
                  @change="handleChangeSchema"
                >
                  <a-select-option
                    v-for="item in catalogsInfo"
                    :value="item.name"
                    :label="item.name"
                    :key="item.name"
                  />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="模式（Schema）">
                <a-select
                  v-model:value="selectObject.schema"
                  show-search
                  @change="handleChangeSchema"
                >
                  <a-select-option
                    v-for="item in schemasInfo"
                    :value="item.name"
                    :label="item.name"
                    :key="item.name"
                  />
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="flex flex-grow overflow-auto">
        <div class="w-[calc(50%-40px)] flex-wrap">
          <div class="h-[20px] w-full text-[13px]">待选择数据表</div>
          <div class="h-[calc(100%-20px)] w-full border-[1px]">
            <div class="h-[calc(100%-46px)] w-full p-2">
              <div class="max-h-full overflow-auto">
                <template
                  v-for="(table, index) in unTables"
                  :key="table.tableName"
                >
                  <div
                    @dblclick="handleSelectTable(table, index)"
                    @click="handleClickTable(table, 'select')"
                    v-if="table.filter !== true && table.show !== false"
                    :class="
                      selectTable?.tableName === table.tableName
                        ? 'table-item-select'
                        : ''
                    "
                    class="table-item mb-2 flex h-[32px] w-full items-center gap-1"
                  >
                    <div>
                      <TableOutlined />
                    </div>
                    <div>
                      <template v-if="table.tableAlias">
                        {{ table.tableAlias }} ({{ table.tableName }})
                      </template>
                      <template v-else>
                        {{ table.tableName }}
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="box-border h-[46px] w-full p-2">
              <a-input
                :suffix="h(SearchOutlined)"
                v-model:value="searchTextObj.unSelectText"
                @change="handleFilterTable('unSelect')"
              />
            </div>
          </div>
        </div>
        <div class="flex w-[80px] flex-wrap items-center justify-between p-2">
          <div></div>
          <div class="flex w-full flex-wrap items-center gap-5 text-center">
            <div class="h-[30px] w-full">
              <a-tooltip title="添加">
                <a-button
                  type="primary"
                  :icon="h(StepForwardOutlined)"
                  @click="handleOperate('add')"
                />
              </a-tooltip>
            </div>
            <div class="h-[30px] w-full">
              <a-tooltip title="添加所有">
                <a-button
                  type="primary"
                  :icon="h(FastForwardOutlined)"
                  @click="handleOperate('addAll')"
                />
              </a-tooltip>
            </div>
            <div class="h-[30px] w-full">
              <a-tooltip title="删除">
                <a-button
                  type="primary"
                  :icon="h(StepBackwardOutlined)"
                  @click="handleOperate('del')"
                />
              </a-tooltip>
            </div>
            <div class="h-[30px] w-full">
              <a-tooltip title="删除所有">
                <a-button
                  type="primary"
                  :icon="h(FastBackwardOutlined)"
                  @click="handleOperate('delAll')"
                />
              </a-tooltip>
            </div>
          </div>
          <div></div>
        </div>
        <div class="flex-1 flex-wrap">
          <div class="h-[20px] w-full text-[13px]">已选择数据表</div>
          <div class="h-[calc(100%-20px)] w-full border-[1px]">
            <div class="h-[calc(100%-46px)] w-full p-2">
              <div class="max-h-full overflow-auto">
                <template
                  v-for="(table, index) in tables"
                  :key="table.tableName"
                >
                  <div
                    @dblclick="handleUnSelectTable(table, index)"
                    @click="handleClickTable(table, 'unSelect')"
                    v-if="table.filter !== true && table.show !== false"
                    :class="
                      unSelectTable?.tableName === table.tableName
                        ? 'table-item-select'
                        : ''
                    "
                    class="table-item mb-2 flex h-[32px] w-full items-center gap-1"
                  >
                    <div>
                      <TableOutlined />
                    </div>
                    <template v-if="table.tableAlias">
                      <template
                        v-if="
                          categoryTypeEnum === DataBaseCategoryEnum.Relational
                        "
                      >
                        {{ table.schema }}.
                      </template>
                      {{ table.tableAlias }} ({{ table.tableName }})
                    </template>
                    <template v-else>
                      <template
                        v-if="
                          categoryTypeEnum === DataBaseCategoryEnum.Relational
                        "
                      >
                        {{ table.schema }}.
                      </template>
                      {{ table.tableName }}
                    </template>
                  </div>
                </template>
              </div>
            </div>
            <div class="box-border h-[46px] w-full p-2">
              <a-input
                :suffix="h(SearchOutlined)"
                v-model:value="searchTextObj.selectText"
                @change="handleFilterTable('select')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>

<style scoped lang="scss">
.table-item {
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  line-height: 32px;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}

.table-item:hover {
  background-color: hsl(var(--primary) / 15%);
  transition: 0.3s;
}

.table-item-select {
  background-color: hsl(var(--primary) / 15%);
}
</style>
