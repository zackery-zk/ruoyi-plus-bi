<script lang="ts" setup>
import type { TabModuleKey } from '@vben/constants';
import type { TabDefinition } from '@vben/types';

import type { IContextMenuItem } from '@vben-core/tabs-ui';

import type { ModuleTabItem } from './types';

import { computed, reactive, ref, watch } from 'vue';

import { useContentMaximize } from '@vben/hooks';

import { TabsView } from '@vben-core/tabs-ui';

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@antdv-next/icons';

import { useModuleTabbarStore } from '#/store/module-tabbar';

defineOptions({
  name: 'ModuleTabbar',
});

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'tabEvent', param: any): void;
}>();
interface Props {
  moduleKey: TabModuleKey;
}

const store = useModuleTabbarStore();
const { contentIsMaximize, toggleMaximize } = useContentMaximize();

const collspan = defineModel<boolean>('collspan', {
  required: true,
  default: () => false,
});

const workspace = computed(() => store.getWorkspace(props.moduleKey));
const tabs = computed(() => workspace.value.tabs);
const activeTabId = computed(() => workspace.value.activeTabId);

const editorMode = ref<'create' | 'edit'>('create');

const editorForm = reactive<{
  componentKey: string;
  moduleKey: string;
  paramsText: string;
  title: string;
}>({
  componentKey: '',
  moduleKey: props.moduleKey,
  paramsText: '{}',
  title: '',
});

const tabsView = computed(() => {
  return tabs.value.map((tab) => {
    let locked = tab.locked;
    locked = tab.componentKey.includes('-home') ? true : !locked;
    return {
      fullPath: tab.id,
      hash: '',
      key: tab.id,
      matched: [],
      meta: {
        affixTab: tab.pinned,
        tabClosable: locked,
        title: tab.title,
      },
      name: `${props.moduleKey}:${tab.id}`,
      params: {},
      path: tab.id,
      query: {},
      redirectedFrom: undefined,
    } as TabDefinition;
  });
});

watch(
  () => editorForm.moduleKey,
  (moduleKey) => {
    const definitions = store.getComponentDefinitions(moduleKey);
    if (!definitions.some((item) => item.key === editorForm.componentKey)) {
      editorForm.componentKey = definitions[0]?.key ?? '';
    }
  },
);

watch(
  () => editorForm.componentKey,
  (componentKey) => {
    if (!componentKey) {
      return;
    }

    const componentDefinition = store.getComponentDefinition(
      editorForm.moduleKey,
      componentKey,
    );

    if (
      componentDefinition &&
      (!editorForm.title || editorMode.value === 'create')
    ) {
      editorForm.title = componentDefinition.title;
    }
  },
);

function getTabById(tabId: string) {
  return tabs.value.find((item) => item.id === tabId) ?? null;
}

function activateTab(tabId: string) {
  store.setActiveTab(props.moduleKey, tabId);
}

function resolveTabComponent(tab: ModuleTabItem) {
  return store.getResolvedComponent(tab);
}

function closeTab(tab: ModuleTabItem) {
  store.closeTab(props.moduleKey, tab.id);
}

function togglePin(tab: ModuleTabItem) {
  store.togglePin(props.moduleKey, tab.id);
}

function closeLeftTabs(tab: ModuleTabItem) {
  store.closeLeftTabs(props.moduleKey, tab.id);
}

function closeRightTabs(tab: ModuleTabItem) {
  store.closeRightTabs(props.moduleKey, tab.id);
}

function closeOtherTabs(tab: ModuleTabItem) {
  store.closeOtherTabs(props.moduleKey, tab.id);
}

function closeAllTabs() {
  store.closeAllTabs(props.moduleKey);
}

function isTabLocked(tab: ModuleTabItem) {
  return !!tab.locked;
}

function canClose(tab: ModuleTabItem) {
  return tab.closable && !isTabLocked(tab);
}

function hasClosableTabsOnLeft(tab: ModuleTabItem) {
  const index = tabs.value.findIndex((item) => item.id === tab.id);
  if (index <= 0) {
    return false;
  }
  return tabs.value
    .slice(0, index)
    .some((item) => item.closable && !isTabLocked(item));
}

function hasClosableTabsOnRight(tab: ModuleTabItem) {
  const index = tabs.value.findIndex((item) => item.id === tab.id);
  if (index === -1) {
    return false;
  }
  return tabs.value
    .slice(index + 1)
    .some((item) => item.closable && !isTabLocked(item));
}

function hasClosableOtherTabs(tab: ModuleTabItem) {
  return tabs.value.some(
    (item) => item.id !== tab.id && item.closable && !isTabLocked(item),
  );
}

function hasClosableTabs() {
  return tabs.value.some((item) => item.closable && !isTabLocked(item));
}

function createContextMenus(tabLike: { key?: string }): IContextMenuItem[] {
  const tab = tabLike.key ? getTabById(tabLike.key) : null;
  if (!tab) {
    return [];
  }

  return [
    {
      disabled: !canClose(tab),
      handler: () => closeTab(tab),
      key: 'close',
      text: '关闭',
    },
    {
      disabled: isTabLocked(tab),
      handler: () => togglePin(tab),
      key: 'pin',
      text: tab.pinned ? '取消固定' : '固定',
    },
    {
      handler: () => toggleMaximize(),
      key: 'maximize',
      text: contentIsMaximize.value ? '还原最大化' : '最大化',
    },
    {
      disabled: !hasClosableTabsOnLeft(tab),
      handler: () => closeLeftTabs(tab),
      key: 'close-left',
      separator: true,
      text: '关闭左侧页签',
    },
    {
      disabled: !hasClosableTabsOnRight(tab),
      handler: () => closeRightTabs(tab),
      key: 'close-right',
      text: '关闭右侧页签',
    },
    {
      disabled: !hasClosableOtherTabs(tab),
      handler: () => closeOtherTabs(tab),
      key: 'close-other',
      text: '关闭其它页签',
    },
    {
      disabled: !hasClosableTabs(),
      handler: () => closeAllTabs(),
      key: 'close-all',
      text: '关闭全部',
    },
  ];
}

function handleCloseByKey(tabId: string) {
  const tab = getTabById(tabId);
  if (!tab) {
    return;
  }
  closeTab(tab);
}

function handleUnpin(tabLike: { key?: string }) {
  const tab = tabLike.key ? getTabById(tabLike.key) : null;
  if (!tab) {
    return;
  }
  togglePin(tab);
}

function handleCollspan() {
  collspan.value = !collspan.value;
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-card">
    <div class="flex items-center border-b h-[39px]">
      <div class="ml-[2px]">
        <a-button type="text" @click="handleCollspan">
          <template #icon>
            <MenuUnfoldOutlined v-if="collspan" />
            <MenuFoldOutlined v-else />
          </template>
        </a-button>
      </div>
      <TabsView
        :active="activeTabId"
        :context-menus="createContextMenus"
        :draggable="false"
        :show-icon="false"
        style-type="card"
        :tabs="tabsView"
        :wheelable="true"
        :middle-click-to-close="true"
        class="flex-1"
        content-class="module-tabs-content"
        @close="handleCloseByKey"
        @unpin="handleUnpin"
        @update:active="activateTab"
      />
    </div>

    <div class="min-h-0 flex-1 w-full overflow-hidden">
      <template v-for="tab in tabs" :key="tab.id">
        <KeepAlive>
          <component
            :is="resolveTabComponent(tab)"
            v-if="resolveTabComponent(tab) && tab.id === activeTabId"
            :key="tab.id"
            :params="tab.params"
            :tab="tab"
            @tab-event="(param: any) => emit('tabEvent', param)"
          />
        </KeepAlive>
      </template>
    </div>
  </div>
</template>

<style scoped>
.module-tabs-content {
  @apply h-full;
}
</style>
