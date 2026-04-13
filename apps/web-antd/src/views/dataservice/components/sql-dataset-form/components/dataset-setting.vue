<script setup lang="ts">
import type { DatasetConfig } from '#/api/dataservice/sql-dataset/model';


const datasetConfig = defineModel<DatasetConfig>('datasetConfig', {
  required: true,
  default:()=>{
    return {
      cacheEnable: false,
      cacheTime: 8,
      cacheTimeUnit: 'hour'
    }
  }
});

const options = [
  {
    label:'小时',
    value:'hour'
  },
  {
    label:'分钟',
    value:'minute'
  },
  {
    label:'秒',
    value:'second'
  }
]


</script>

<template>
  <div class="w-full h-full p-4">
    <a-form>
      <a-form-item label="是否启用缓存">
        <a-switch v-model:checked="datasetConfig.cacheEnable" />
      </a-form-item>
      <a-form-item label="缓存有效时长" v-if="datasetConfig.cacheEnable">
        <a-flex gap="10">
          <a-input-number v-model:value="datasetConfig.cacheTime" />
          <a-select class="!w-[120px]" :options="options" v-model:value="datasetConfig.cacheTimeUnit" />
        </a-flex>
      </a-form-item>
    </a-form>
  </div>
</template>
