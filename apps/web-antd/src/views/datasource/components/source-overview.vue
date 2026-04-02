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

const keyword = ref('');

const paramsText = computed(() => JSON.stringify(props.params, null, 2));
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <h3 class="text-base font-semibold">数据源总览</h3>
      <Tag color="processing">默认页签</Tag>
    </div>
    <Input v-model:value="keyword" placeholder="输入一些内容后切换页签试试缓存" />
    <pre class="rounded-lg bg-muted p-3 text-xs">{{ paramsText }}</pre>
  </div>
</template>
