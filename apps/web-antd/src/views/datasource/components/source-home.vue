<script setup lang="ts">
import type {  DataBaseCategory,
  DataBaseType,} from '../data/datasource-lib'

import { computed, ref, watch } from 'vue';

import  {
  TabEventTypeEnum,
} from '@vben/constants';

import { dataBaseCategoryList } from '../data/datasource-lib';

const emits = defineEmits<{
  (e: 'tabEvent', params: any): void;
}>();

const visibleCategories = computed(() =>
  (dataBaseCategoryList as DataBaseCategory[]).filter((c) => c.show !== false),
);

const activeTab = ref<string>('');
watch(
  visibleCategories,
  (list) => {
    if (!activeTab.value && list.length > 0) {
      activeTab.value = list[0].name;
    }
  },
  { immediate: true },
);

const keyword = ref<string>('');

const categoryChildrenMap = computed<Record<string, DataBaseType[]>>(() => {
  const map: Record<string, DataBaseType[]> = {};
  for (const c of visibleCategories.value) {
    map[c.name] = c.children ?? [];
  }
  return map;
});

const filteredCategoryChildrenMap = computed<Record<string, DataBaseType[]>>(
  () => {
    const kw = keyword.value.trim().toLowerCase();
    if (!kw) return categoryChildrenMap.value;

    const map: Record<string, DataBaseType[]> = {};
    for (const c of visibleCategories.value) {
      map[c.name] = (c.children ?? []).filter((child) =>
        (child.name ?? '').toLowerCase().includes(kw),
      );
    }
    return map;
  },
);

function handleSearch(val: string) {
  keyword.value = val;
}

function handlePickType(item: DataBaseType) {
  emits('tabEvent', {key:TabEventTypeEnum.NEW_DATASOURCE,data:{type:item.type}});
}
</script>

<template>
  <div class="flex h-full w-full p-4">
    <!-- 分类标签页 -->
    <a-tabs v-model:active-key="activeTab" class="ds-tabs w-full" centered>
      <template #rightExtra>
        <a-input-search
          size="small"
          :bordered="false"
          v-model:value="keyword"
          allow-clear
          placeholder="输入关键字搜索"
          @search="handleSearch"
        />
      </template>
      <a-tab-pane
        v-for="cat in visibleCategories"
        :key="cat.name"
        :tab="cat.label"
      >
        <a-row
          :gutter="[10, 10]"
          v-if="(filteredCategoryChildrenMap[cat.name] ?? []).length > 0"
        >
          <a-col
            :span="2"
            v-for="item in filteredCategoryChildrenMap[cat.name]"
            :key="item.name"
          >
            <div
              :key="item.type"
              class="ds-card flex h-full w-full flex-col items-center justify-center p-1"
              role="button"
              tabindex="0"
              @click="handlePickType(item)"
              @keydown.enter="handlePickType(item)"
            >
              <div
                class="ds-card__icon flex w-full items-center justify-center"
              >
                <component :is="item.icon" class="h-[5em] w-[5em]" />
              </div>
              <div class="ds-card__main p-1">
                <div class="ds-card__name text-xs">{{ item.name }}</div>
              </div>
            </div>
          </a-col>
        </a-row>
        <template v-else>
          <a-empty description="暂无匹配的数据源类型" />
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="scss" scoped>
.ds-card {
  cursor: pointer;
  border: 1px solid hsl(var(--border));
  border-radius: 0.375rem;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.ds-card:hover {
  border-color: hsl(var(--primary));
  box-shadow: 0 10px 28px hsl(var(--primary) / 8%);
  transform: translateY(-1px);
}

.ds-card__icon {
  flex: none;
  width: 62px;
  height: 62px;
  color: hsl(var(--primary));
  background: hsl(var(--background) / 12%);
  border-radius: 10px;
  transform-origin: center;
  transition: transform 0.2s ease;
}

.ds-card:hover .ds-card__icon {
  transform: scale(1.3);
}

.ds-card__name {
  font-weight: 600;
}
</style>
