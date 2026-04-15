<script setup lang="ts">
import { computed, h, nextTick, ref, watch } from 'vue';

import { SearchOutlined } from '@antdv-next/icons';

import { useModelDataSetStore } from '../../store/useModelDataSetStore';
import ModelData from './component/model-data.vue';
import ModelFields from './component/model-fields.vue';

const activeKey = ref('fields');
const modelDataRef = ref<InstanceType<typeof ModelData>>();
const modelFieldsRef = ref<InstanceType<typeof ModelFields>>();
const items = ref([
  {
    key: 'fields',
    label: '字段结构',
  },
  {
    key: 'data',
    label: '预览数据',
  },
]);
const modelDataSetStore = useModelDataSetStore();

const selectNodeId = computed(() => {
  return modelDataSetStore.selectNodeId;
});

const isLoading = ref<{
  data: boolean;
  fields: boolean;
}>({
  data: false,
  fields: false,
});

watch(
  () => selectNodeId.value,
  (newValue) => {
    if (newValue) {
      isLoading.value = {
        data: false,
        fields: false,
      };

      if (activeKey.value === 'fields') {
        isLoading.value.fields = true;
        modelFieldsRef.value?.queryData();
      } else {
        isLoading.value.data = true;
        modelDataRef.value?.queryData();
      }
    }
  },
);

function handleTabChange(key: string) {
  activeKey.value = key;
  nextTick(() => {
    if (key === 'fields' && !isLoading.value.fields) {
      isLoading.value.fields = true;
      modelFieldsRef.value?.queryData();
    } else if (key === 'data' && !isLoading.value.data) {
      isLoading.value.data = true;
      modelDataRef.value?.queryData();
    }
  });
}
</script>

<template>
  <div class="w-full h-full px-2 flex flex-col">
    <a-tabs
      :items="items"
      v-model:active-key="activeKey"
      size="small"
      @change="handleTabChange"
    >
      <template #rightExtra>
        <a-flex align="center" gap="10" v-if="activeKey === 'data'">
          <a-button
            :icon="h(SearchOutlined)"
            size="small"
            @click="modelDataRef?.queryData"
          />
        </a-flex>
      </template>
    </a-tabs>
    <div class="w-full flex-1 h-0">
      <ModelData v-show="activeKey === 'data'" ref="modelDataRef" />
      <ModelFields v-show="activeKey === 'fields'" ref="modelFieldsRef" />
    </div>
  </div>
</template>
