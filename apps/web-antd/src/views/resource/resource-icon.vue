<script lang="ts" setup>
import { ResourceTypeEnum } from '@vben/constants';
import { SvgResDataSourceIcon, SvgResDataSourceRootIcon, SvgResFolderIcon } from '@vben/icons';
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
          resType === ResourceTypeEnum.PUBLIC_FOLDER
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
    </template>
  </div>
</template>
