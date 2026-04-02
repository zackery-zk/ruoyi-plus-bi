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

const endpoint = ref('');
const mockPayload = ref('');

const paramsText = computed(() => JSON.stringify(props.params, null, 2));
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-semibold">数据服务调试</h3>
    <Input v-model:value="endpoint" placeholder="请求地址" />
    <TextArea
      v-model:value="mockPayload"
      :auto-size="{ minRows: 4, maxRows: 8 }"
      placeholder="模拟请求体"
    />
    <pre class="rounded-lg bg-muted p-3 text-xs">{{ paramsText }}</pre>
  </div>
</template>
