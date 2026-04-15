<script setup lang="ts">
import { BiLoading } from '#/components/bi-loading';
interface Props {
  loading?: boolean;
  panelLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  panelLoading: false,
});
</script>

<template>
  <div class="w-full h-full relative">
    <BiLoading :loading="loading">
      <a-card
        :loading="panelLoading"
        variant="borderless"
        :classes="{
          root: 'flex h-full min-h-0 w-full flex-col overflow-hidden',
          body: 'min-h-0 flex-1 overflow-hidden !p-0',
        }"
        :styles="{
          root: {
            boxShadow: 'none',
          },
        }"
      >
        <template #title>
          <slot name="title"></slot>
        </template>
        <template #extra>
          <slot name="extra"></slot>
        </template>
        <template #actions>
          <div class="px-2">
            <slot name="actions"></slot>
          </div>
        </template>
        <slot></slot>
      </a-card>
    </BiLoading>
  </div>
</template>
