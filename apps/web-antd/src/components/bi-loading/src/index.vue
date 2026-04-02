<script setup lang="ts">
interface Props {
  loading: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});
</script>

<template>
  <a-spin :spinning="loading" :classes="{ root: 'bi-spin-content' }">
    <template #description>
      <div class="flex-col flex gap-2">
        <div>爱你魔力转圈圈...</div>
      </div>
    </template>
    <slot></slot>
  </a-spin>
</template>
<style lang="scss" scoped>
.bi-spin-content {
  width: 100%;
  height: 100%;

  :deep(.ant-spin-container) {
    width: 100%;
    height: 100%;
  }
}
</style>
