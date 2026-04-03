import type { ID } from '#/api/common';
import type {
  ModuleTabComponentDefinition,
  ModuleTabDraft,
  ModuleTabItem,
  ModuleTabModuleDefinition,
  ModuleTabWorkspace,
} from '#/components/module-tabbar';

import { computed, markRaw, reactive } from 'vue';

import { buildShortUUID, cloneDeep } from '@vben/utils';

import { defineStore } from 'pinia';

function cloneParams(params?: Record<string, unknown>) {
  return params ? cloneDeep(params) : {};
}

function normalizeComponentDefinition(
  definition: ModuleTabComponentDefinition,
): ModuleTabComponentDefinition {
  return {
    ...definition,
    cache: definition.cache ?? true,
    component: markRaw(definition.component),
  };
}

function createTabItem(
  hostModuleKey: string,
  sourceModuleKey: string,
  definition: ModuleTabComponentDefinition,
  draft?: ModuleTabDraft,
  locked = false,
): ModuleTabItem {
  const pinned = locked;

  return {
    cache: definition.cache ?? true,
    closable: !pinned,
    componentKey: definition.key,
    hostModuleKey,
    id: buildShortUUID(`${hostModuleKey}_${definition.key}`),
    locked,
    moduleKey: sourceModuleKey,
    params: {
      ...cloneParams(draft?.params),
    },
    pinned,
    title: draft?.title || definition.title,
    resId: draft?.resId,
  };
}

function normalizeModuleDefinition(
  definition: ModuleTabModuleDefinition,
): ModuleTabModuleDefinition {
  return {
    ...definition,
    components: definition.components.map(normalizeComponentDefinition),
  };
}

export const useModuleTabbarStore = defineStore('app-module-tabbar', () => {
  const moduleRegistry = reactive(new Map<string, ModuleTabModuleDefinition>());
  const workspaces = reactive(new Map<string, ModuleTabWorkspace>());

  const moduleOptions = computed(() => {
    return [...moduleRegistry.values()].map((item) => ({
      label: item.title,
      value: item.key,
    }));
  });

  function getModuleDefinition(moduleKey: string) {
    return moduleRegistry.get(moduleKey);
  }

  function getComponentDefinitions(moduleKey: string) {
    return moduleRegistry.get(moduleKey)?.components ?? [];
  }

  function getComponentDefinition(moduleKey: string, componentKey: string) {
    return getComponentDefinitions(moduleKey).find(
      (item) => item.key === componentKey,
    );
  }

  function ensureWorkspace(moduleKey: string) {
    const existed = workspaces.get(moduleKey);
    if (existed) {
      return existed;
    }

    const created: ModuleTabWorkspace = reactive({
      activeTabId: '',
      initialized: false,
      moduleKey,
      tabs: [],
    });

    workspaces.set(moduleKey, created);
    return created;
  }

  function ensureDefaultTabs(moduleKey: string) {
    const workspace = ensureWorkspace(moduleKey);
    if (workspace.initialized) {
      if (!workspace.activeTabId && workspace.tabs[0]) {
        workspace.activeTabId = workspace.tabs[0].id;
      }
      return workspace;
    }

    const moduleDefinition = moduleRegistry.get(moduleKey);
    if (!moduleDefinition) {
      return workspace;
    }

    workspace.tabs = moduleDefinition.defaultTabs
      .map((draft) => {
        const targetModuleKey = draft.moduleKey || moduleKey;
        const componentDefinition = getComponentDefinition(
          targetModuleKey,
          draft.componentKey,
        );
        if (!componentDefinition) {
          return null;
        }
        return createTabItem(
          moduleKey,
          targetModuleKey,
          componentDefinition,
          draft,
          true,
        );
      })
      .filter((item): item is ModuleTabItem => !!item);

    workspace.activeTabId = workspace.tabs[0]?.id ?? '';
    workspace.initialized = true;

    return workspace;
  }

  function registerModule(definition: ModuleTabModuleDefinition) {
    const normalized = normalizeModuleDefinition(definition);
    moduleRegistry.set(normalized.key, normalized);
    ensureDefaultTabs(normalized.key);
  }

  function setActiveTab(hostModuleKey: string, tabId: string) {
    const workspace = ensureDefaultTabs(hostModuleKey);
    if (!workspace.tabs.some((item) => item.id === tabId)) {
      return;
    }
    workspace.activeTabId = tabId;
  }

  function getWorkspace(moduleKey: string) {
    return ensureDefaultTabs(moduleKey);
  }

  function getActiveTab(moduleKey: string) {
    const workspace = getWorkspace(moduleKey);
    return (
      workspace.tabs.find((item) => item.id === workspace.activeTabId) ??
      workspace.tabs[0] ??
      null
    );
  }

  function addTab(hostModuleKey: string, draft: ModuleTabDraft) {
    const workspace = ensureDefaultTabs(hostModuleKey);
    const targetModuleKey = draft.moduleKey || hostModuleKey;
    const componentDefinition = getComponentDefinition(
      targetModuleKey,
      draft.componentKey,
    );

    if (!componentDefinition) {
      throw new Error(
        `Component ${draft.componentKey} is not registered in module ${targetModuleKey}.`,
      );
    }
    const existedTab = getTabByResId(hostModuleKey, draft.resId ?? '');
    if (existedTab) {
      workspace.activeTabId = existedTab.id;
      return existedTab;
    }

    const tab = createTabItem(
      hostModuleKey,
      targetModuleKey,
      componentDefinition,
      draft,
    );

    workspace.tabs.push(tab);
    workspace.activeTabId = tab.id;

    return tab;
  }

  function updateTab(
    hostModuleKey: string,
    tabId: string,
    draft: ModuleTabDraft,
  ) {
    const workspace = ensureDefaultTabs(hostModuleKey);
    const index = workspace.tabs.findIndex((item) => item.id === tabId);
    if (index === -1) {
      return null;
    }

    const currentTab = workspace.tabs[index];
    if (!currentTab) {
      return null;
    }

    const targetModuleKey = draft.moduleKey || currentTab.moduleKey;
    const componentKey = draft.componentKey || currentTab.componentKey;
    const componentDefinition = getComponentDefinition(
      targetModuleKey,
      componentKey,
    );

    if (!componentDefinition) {
      throw new Error(
        `Component ${componentKey} is not registered in module ${targetModuleKey}.`,
      );
    }

    const nextTab: ModuleTabItem = {
      ...currentTab,
      cache: componentDefinition.cache ?? true,
      componentKey,
      moduleKey: targetModuleKey,
      params: cloneParams(draft.params),
      title: draft.title || componentDefinition.title,
      resId: draft.resId,
    };

    workspace.tabs.splice(index, 1, nextTab);
    workspace.activeTabId = nextTab.id;

    return nextTab;
  }

  function getTabByResId(hostModuleKey: string, resId: ID) {
    const workspace = ensureDefaultTabs(hostModuleKey);
    return workspace.tabs.find((item) => item.resId === resId);
  }

  function updateTabById(
    hostModuleKey: string,
    tabId: string,
    title: string | undefined,
    resId: ID,
  ) {
    const workspace = ensureDefaultTabs(hostModuleKey);
    const index = workspace.tabs.findIndex((item) => item.id === tabId);
    if (index === -1) {
      return null;
    }

    const currentTab = workspace.tabs[index];
    if (!currentTab) return;

    currentTab.title = title;
    currentTab.resId = resId;
    workspace.tabs.splice(index, 1, currentTab);
    workspace.activeTabId = currentTab.id;

    return currentTab;
  }

  function getTabIndex(hostModuleKey: string, tabId: string) {
    return getWorkspace(hostModuleKey).tabs.findIndex(
      (item) => item.id === tabId,
    );
  }

  function setFallbackActiveTab(
    workspace: ModuleTabWorkspace,
    fallbackIndex: number,
  ) {
    const nextTab =
      workspace.tabs[fallbackIndex] ??
      workspace.tabs[fallbackIndex - 1] ??
      workspace.tabs[0];
    workspace.activeTabId = nextTab?.id ?? '';
  }

  function closeTab(hostModuleKey: string, tabId: string) {
    const workspace = ensureDefaultTabs(hostModuleKey);
    const index = workspace.tabs.findIndex((item) => item.id === tabId);
    if (index === -1) {
      return;
    }

    const currentTab = workspace.tabs[index];
    if (!currentTab || currentTab.pinned || currentTab.locked) {
      return;
    }

    workspace.tabs.splice(index, 1);

    if (workspace.activeTabId === tabId) {
      setFallbackActiveTab(workspace, index);
    }
  }

  function closeTabsByPredicate(
    hostModuleKey: string,
    predicate: (
      tab: ModuleTabItem,
      index: number,
      tabs: ModuleTabItem[],
    ) => boolean,
  ) {
    const workspace = ensureDefaultTabs(hostModuleKey);
    const currentActiveTabId = workspace.activeTabId;

    workspace.tabs = workspace.tabs.filter((tab, index, tabs) => {
      if (tab.pinned || tab.locked) {
        return true;
      }

      return !predicate(tab, index, tabs);
    });

    if (!workspace.tabs.some((item) => item.id === currentActiveTabId)) {
      workspace.activeTabId = workspace.tabs[0]?.id ?? '';
    }
  }

  function closeLeftTabs(hostModuleKey: string, tabId: string) {
    const targetIndex = getTabIndex(hostModuleKey, tabId);
    if (targetIndex <= 0) {
      return;
    }

    closeTabsByPredicate(hostModuleKey, (_tab, index) => index < targetIndex);
  }

  function closeRightTabs(hostModuleKey: string, tabId: string) {
    const targetIndex = getTabIndex(hostModuleKey, tabId);
    if (targetIndex < 0) {
      return;
    }

    closeTabsByPredicate(hostModuleKey, (_tab, index) => index > targetIndex);
  }

  function closeOtherTabs(hostModuleKey: string, tabId: string) {
    closeTabsByPredicate(hostModuleKey, (tab) => tab.id !== tabId);
    setActiveTab(hostModuleKey, tabId);
  }

  function closeAllTabs(hostModuleKey: string) {
    closeTabsByPredicate(hostModuleKey, () => true);
  }

  function togglePin(hostModuleKey: string, tabId: string) {
    const workspace = ensureDefaultTabs(hostModuleKey);
    const tab = workspace.tabs.find((item) => item.id === tabId);
    if (!tab || tab.locked) {
      return;
    }

    tab.pinned = !tab.pinned;
    tab.closable = !tab.pinned;
  }

  function getResolvedComponent(tab: ModuleTabItem) {
    return (
      getComponentDefinition(tab.moduleKey, tab.componentKey)?.component ?? null
    );
  }

  function $reset() {
    moduleRegistry.clear();
    workspaces.clear();
  }

  return {
    $reset,
    addTab,
    closeAllTabs,
    closeLeftTabs,
    closeOtherTabs,
    closeRightTabs,
    closeTab,
    ensureDefaultTabs,
    getActiveTab,
    getComponentDefinition,
    getComponentDefinitions,
    getModuleDefinition,
    getResolvedComponent,
    getWorkspace,
    moduleOptions,
    registerModule,
    setActiveTab,
    togglePin,
    updateTab,
    updateTabById,
  };
});
