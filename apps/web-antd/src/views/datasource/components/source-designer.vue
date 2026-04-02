<script lang="ts" setup>
import { computed, ref } from 'vue';

import { Input, TextArea } from 'antdv-next';

const props = withDefaults(
  defineProps<{
    params?: Record<string, unknown>;
  }>(),
  {
    params: () => ({}),
  },
);

const name = ref('');
const description = ref('');

const paramsText = computed(() => JSON.stringify(props.params, null, 2));
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-semibold">数据源设计器</h3>
    <Input v-model:value="name" placeholder="数据源名称" />
    <TextArea
      v-model:value="description"
      :auto-size="{ minRows: 4, maxRows: 8 }"
      placeholder="描述信息"
    />
    <pre class="rounded-lg bg-muted p-3 text-xs">{{ paramsText }}</pre>
  </div>
</template>
