<script lang="ts" setup>
import { ResourceTypeEnum } from '@vben/constants';
import {
  SvgResDataServiceRootIcon,
  SvgResDataSourceIcon,
  SvgResDataSourceRootIcon,
  SvgResFieldIcon,
  SvgResFolderIcon,
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
  resIcon: null | string;
  resType: ResourceTypeEnum;
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
    </template>
  </div>
</template>
