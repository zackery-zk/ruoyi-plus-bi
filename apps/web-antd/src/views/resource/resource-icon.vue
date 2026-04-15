<script lang="ts" setup>
import {
  AggTypeEnum,
  DataTypeClassEnum,
  DataTypeEnum,
  getDataTypeClass,
  ResourceTypeEnum,
} from '@vben/constants';
import {
  SvgAggAvgIcon,
  SvgAggCountIcon,
  SvgAggDisCountIcon,
  SvgAggMaxIcon,
  SvgAggMinIcon,
  SvgAggSumIcon,
  SvgDataTypeDateIcon,
  SvgDataTypeDateTimeIcon,
  SvgDataTypeNumberIcon,
  SvgDataTypeStringIcon,
  SvgDataTypeTimeIcon,
  SvgResDataServiceRootIcon,
  SvgResDataSourceIcon,
  SvgResDataSourceRootIcon,
  SvgResDimensionIcon,
  SvgResFieldIcon,
  SvgResFolderIcon,
  SvgResMeasureIcon,
  SvgResSchemaIcon,
  SvgResSqlDatasetIcon,
  SvgResSqlFieldIcon,
  SvgResTableIcon,
} from '@vben/icons';
defineOptions({
  name: 'ResourceIcon',
  inheritAttrs: false,
});

defineProps<Props>();
interface Props {
  resIcon?: null | string;
  resType?: ResourceTypeEnum;
  dataType?: DataTypeEnum;
  aggType?: AggTypeEnum;
}
</script>

<template>
  <div class="flex items-center justify-center w-full h-full">
    <template v-if="resIcon">
      <span v-bind="$attrs" vue-dompurify-html="resIcon"></span>
    </template>
    <template v-else>
      <template
        v-if="
          resType === ResourceTypeEnum.FOLDER ||
          resType === ResourceTypeEnum.PUBLIC_FOLDER ||
          resType === ResourceTypeEnum.SELF_FOLDER
        "
      >
        <SvgResFolderIcon v-bind="$attrs" />
      </template>
      <template v-else-if="resType === ResourceTypeEnum.DATA_SOURCES">
        <SvgResDataSourceRootIcon v-bind="$attrs" />
      </template>
      <template v-else-if="resType === ResourceTypeEnum.DATA_SOURCE">
        <SvgResDataSourceIcon v-bind="$attrs" />
      </template>
      <template v-else-if="resType === ResourceTypeEnum.SCHEMA">
        <SvgResSchemaIcon v-bind="$attrs" />
      </template>
      <template v-else-if="resType === ResourceTypeEnum.BASIC_TABLE">
        <SvgResTableIcon v-bind="$attrs" />
      </template>
      <template v-else-if="resType === ResourceTypeEnum.BASIC_FIELD">
        <SvgResFieldIcon v-bind="$attrs" />
      </template>
      <template v-else-if="resType === ResourceTypeEnum.DATA_SERVICES">
        <SvgResDataServiceRootIcon v-bind="$attrs" />
      </template>
      <template v-else-if="resType === ResourceTypeEnum.SQL_DATASET">
        <SvgResSqlDatasetIcon v-bind="$attrs" />
      </template>
      <template v-else-if="resType === ResourceTypeEnum.SQL_FIELD">
        <SvgResSqlFieldIcon v-bind="$attrs" />
      </template>

      <template v-else-if="resType === ResourceTypeEnum.DIMENSION">
        <template v-if="dataType === DataTypeEnum.String">
          <SvgDataTypeStringIcon v-bind="$attrs" />
        </template>
        <template
          v-else-if="getDataTypeClass(dataType) === DataTypeClassEnum.Number"
        >
          <SvgDataTypeNumberIcon v-bind="$attrs" />
        </template>
        <template v-else-if="DataTypeEnum.Date === dataType">
          <SvgDataTypeDateIcon v-bind="$attrs" />
        </template>
        <template v-else-if="DataTypeEnum.Time === dataType">
          <SvgDataTypeTimeIcon v-bind="$attrs" />
        </template>
        <template v-else-if="DataTypeEnum.DateTime === dataType">
          <SvgDataTypeDateTimeIcon v-bind="$attrs" />
        </template>
        <template v-else>
          <SvgResDimensionIcon v-bind="$attrs" />
        </template>
      </template>
      <template v-else-if="resType === ResourceTypeEnum.MEASURE">
        <template v-if="aggType === AggTypeEnum.SUM">
          <SvgAggSumIcon v-bind="$attrs" />
        </template>
        <template v-else-if="aggType === AggTypeEnum.AVG">
          <SvgAggAvgIcon v-bind="$attrs" />
        </template>
        <template v-else-if="aggType === AggTypeEnum.MAX">
          <SvgAggMaxIcon v-bind="$attrs" />
        </template>
        <template v-else-if="aggType === AggTypeEnum.MIN">
          <SvgAggMinIcon v-bind="$attrs" />
        </template>
        <template v-else-if="aggType === AggTypeEnum.COUNT">
          <SvgAggCountIcon v-bind="$attrs" />
        </template>
        <template v-else-if="aggType === AggTypeEnum.DISTINCT_COUNT">
          <SvgAggDisCountIcon v-bind="$attrs" />
        </template>
        <template v-else>
          <SvgResMeasureIcon v-bind="$attrs" />
        </template>
      </template>
    </template>
  </div>
</template>
