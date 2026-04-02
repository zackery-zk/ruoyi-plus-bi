<script lang="ts" setup>
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';

import { computed, provide, shallowReactive, unref, watch } from 'vue';
import { routeLocationKey, RouterView, routerViewLocationKey } from 'vue-router';

import { usePreferences } from '@vben/preferences';
import {
  getTabKey,
  storeToRefs,
  useAccessStore,
  useTabbarStore,
} from '@vben/stores';

import {
  transformComponent,
  useLayoutHook,
  useMenuContentRoute,
} from '../../hooks';
import { IFrameRouterView } from '../../iframe';
import { RouteCachedPage, RouteCachedView } from '../../route-cached';

defineOptions({ name: 'LayoutContent' });

const accessStore = useAccessStore();
const tabbarStore = useTabbarStore();
const { keepAlive } = usePreferences();

const { getCachedTabs, getExcludeCachedTabs, renderRouteView } =
  storeToRefs(tabbarStore);

const { getEnabledTransition, getTransitionName } = useLayoutHook();
const { menuContentRoute } = useMenuContentRoute();

const providedRoute = shallowReactive({
  ...menuContentRoute.value,
}) as RouteLocationNormalizedLoadedGeneric;

watch(
  menuContentRoute,
  (nextRoute) => {
    const mutableProvidedRoute = providedRoute as unknown as Record<
      string,
      unknown
    >;

    for (const key of Object.keys(providedRoute)) {
      if (!(key in nextRoute)) {
        delete mutableProvidedRoute[key];
      }
    }

    Object.assign(providedRoute, nextRoute);
  },
  { immediate: true },
);

provide(routeLocationKey, providedRoute);
provide(routerViewLocationKey, menuContentRoute);

const cacheByMenuSwitch = computed(
  () => accessStore.menuSwitchByComponent && !keepAlive.value,
);

/**
 * 是否显示component
 * @param route
 */
const showComponent = (route: RouteLocationNormalizedLoadedGeneric) => {
  return !route.meta.domCached && unref(renderRouteView);
};
</script>

<template>
  <div class="relative h-full min-h-0">
    <IFrameRouterView />
    <RouteCachedView />
    <RouterView v-slot="{ Component, route }">
      <RouteCachedPage
        :component="Component"
        :route="route"
        v-if="route.meta.domCached"
      />
      <Transition
        v-if="getEnabledTransition"
        :name="getTransitionName(route)"
        appear
        mode="out-in"
      >
        <KeepAlive v-if="cacheByMenuSwitch">
          <component
            :is="transformComponent(Component, route)"
            v-if="showComponent(route)"
            v-show="!route.meta.iframeSrc"
            :key="getTabKey(route)"
          />
        </KeepAlive>
        <KeepAlive
          v-else-if="keepAlive"
          :exclude="getExcludeCachedTabs"
          :include="getCachedTabs"
        >
          <component
            :is="transformComponent(Component, route)"
            v-if="showComponent(route)"
            v-show="!route.meta.iframeSrc"
            :key="getTabKey(route)"
          />
        </KeepAlive>
        <component
          :is="Component"
          v-else-if="showComponent(route)"
          :key="getTabKey(route)"
        />
      </Transition>
      <template v-else>
        <KeepAlive v-if="cacheByMenuSwitch">
          <component
            :is="transformComponent(Component, route)"
            v-if="showComponent(route)"
            v-show="!route.meta.iframeSrc"
            :key="getTabKey(route)"
          />
        </KeepAlive>
        <KeepAlive
          v-else-if="keepAlive"
          :exclude="getExcludeCachedTabs"
          :include="getCachedTabs"
        >
          <component
            :is="transformComponent(Component, route)"
            v-if="showComponent(route)"
            v-show="!route.meta.iframeSrc"
            :key="getTabKey(route)"
          />
        </KeepAlive>
        <component
          :is="Component"
          v-else-if="showComponent(route)"
          :key="getTabKey(route)"
        />
      </template>
    </RouterView>
  </div>
</template>
