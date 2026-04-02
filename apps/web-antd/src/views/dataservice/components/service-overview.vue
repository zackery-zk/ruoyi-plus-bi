<script lang="ts" setup>
import { computed, ref } from 'vue';

import { Input, Tag } from 'antdv-next';

const props = withDefaults(
  defineProps<{
    params?: Record<string, unknown>;
  }>(),
  {
    params: () => ({}),
  },
);

const serviceName = ref('');

const paramsText = computed(() => JSON.stringify(props.params, null, 2));
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <h3 class="text-base font-semibold">数据服务总览</h3>
      <Tag color="success">默认页签</Tag>
    </div>
    <Input v-model:value="serviceName" placeholder="服务名称" />
    <pre class="rounded-lg bg-muted p-3 text-xs">{{ paramsText }}</pre>
  </div>
</template>
