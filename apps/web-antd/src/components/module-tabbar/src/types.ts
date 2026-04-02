import type { Component } from 'vue';

import type { ID } from '#/api/common';


interface ModuleTabComponentDefinition {
  cache?: boolean;
  component: Component;
  description?: string;
  key: string;
  title: string;
}

interface ModuleTabDraft {
  componentKey: string;
  moduleKey?: string;
  params?: Record<string, unknown>;
  title?: string;
  resId?:ID;
}

interface ModuleTabItem {
  cache: boolean;
  closable: boolean;
  componentKey: string;
  hostModuleKey: string;
  id: string;
  locked?: boolean;
  moduleKey: string;
  params: Record<string, unknown>;
  pinned: boolean;
  title: string;
  resId?:ID;

}

interface ModuleTabModuleDefinition {
  components: ModuleTabComponentDefinition[];
  defaultTabs: ModuleTabDraft[];
  key: string;
  title: string;
}

interface ModuleTabWorkspace {
  activeTabId: string;
  initialized: boolean;
  moduleKey: string;
  tabs: ModuleTabItem[];
}

export type {
  ModuleTabComponentDefinition,
  ModuleTabDraft,
  ModuleTabItem,
  ModuleTabModuleDefinition,
  ModuleTabWorkspace,
};
