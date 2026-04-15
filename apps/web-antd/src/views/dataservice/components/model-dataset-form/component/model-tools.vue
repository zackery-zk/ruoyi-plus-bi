<script setup lang="ts">
import { h, reactive, ref } from 'vue';

import { MODEL_CONNECTION_TYPE_OPTIONS } from '@vben/constants';

import {
  SettingOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@antdv-next/icons';

// 拖动
const sliderValue = ref(100);
const lockScale = ref<boolean>(false);
// 禁止缩放
function handleDisableScale() {
  lockScale.value = !lockScale.value;
}
const sliderMaks = reactive({
  100: '',
});
// 拖动格式化
const sliderFormatTooltip = (v: number) => `${v}%`;
const filterValue = ref('');
// 拖动处理
function sliderHandle(v: any) {}
</script>

<template>
  <div class="nb-dmn-operation-bar">
    <a-flex align="center" gap="10">
      <a-tooltip placement="bottom" title="设置">
        <a-button :icon="h(SettingOutlined)" size="small" />
      </a-tooltip>

      <a-radio-group
        name="radiogroup"
        size="small"
        :options="MODEL_CONNECTION_TYPE_OPTIONS"
      />
      <a-tooltip placement="bottom" title="缩小">
        <a-button :icon="h(ZoomOutOutlined)" size="small" />
      </a-tooltip>
      <a-slider
        v-model:value="sliderValue"
        class="scale-slider"
        :default-value="50"
        :min="10"
        :max="500"
        :step="10"
        :format-tooltip="sliderFormatTooltip"
        :disabled="lockScale"
        :marks="sliderMaks"
        @change="sliderHandle"
      />
      <a-tooltip placement="bottom" title="放大">
        <a-button :icon="h(ZoomInOutlined)" size="small" />
      </a-tooltip>
    </a-flex>
  </div>
</template>
<style lang="scss" scoped>
.nb-dmn-operation-bar {
  position: absolute;
  top: 10px;
  right: 30px;
  z-index: 1000;
  padding: 5px;
  background-color: hsl(var(--background));
  border-radius: var(--ant-border-radius);
  box-shadow: var(--ant-box-shadow);
}

:deep(.scale-slider) {
  width: 100px;
  margin: 0;
}
</style>
