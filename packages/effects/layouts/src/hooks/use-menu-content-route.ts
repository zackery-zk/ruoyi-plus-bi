import type {
  RouteLocationNormalizedLoadedGeneric,
  RouteLocationRaw,
  Router,
} from 'vue-router';

import { computed, shallowRef } from 'vue';
import { loadRouteLocation, useRoute, useRouter } from 'vue-router';

import { useAccessStore } from '@vben/stores';

const menuContentRouteRef =
  shallowRef<RouteLocationNormalizedLoadedGeneric | null>(null);
let menuContentRouteRequestId = 0;

function resolveMenuContentRouteTarget(
  router: Router,
  to: RouteLocationRaw,
): RouteLocationNormalizedLoadedGeneric {
  let resolved = router.resolve(to) as RouteLocationNormalizedLoadedGeneric;
  const visited = new Set<string>();

  while (true) {
    const lastMatched = resolved.matched.at(-1);
    const redirect = lastMatched?.redirect;

    if (!redirect || visited.has(resolved.fullPath)) {
      return resolved;
    }

    visited.add(resolved.fullPath);

    const nextTarget =
      typeof redirect === 'function'
        ? redirect(resolved, router.currentRoute.value)
        : redirect;

    resolved = router.resolve(nextTarget) as RouteLocationNormalizedLoadedGeneric;
  }
}

function useMenuContentRoute() {
  const accessStore = useAccessStore();
  const route = useRoute();
  const router = useRouter();

  const menuContentRoute = computed(() => {
    if (!accessStore.menuSwitchByComponent) {
      return route as RouteLocationNormalizedLoadedGeneric;
    }

    const fullPath = accessStore.menuContentRouteFullPath;
    if (!fullPath) {
      return route as RouteLocationNormalizedLoadedGeneric;
    }

    if (fullPath === route.fullPath) {
      return route as RouteLocationNormalizedLoadedGeneric;
    }

    return (
      menuContentRouteRef.value ??
      (route as RouteLocationNormalizedLoadedGeneric)
    );
  });

  function clearMenuContentRoute() {
    menuContentRouteRequestId++;
    menuContentRouteRef.value = null;
    accessStore.setMenuContentRouteFullPath(null);
  }

  async function setMenuContentRoute(to: RouteLocationRaw) {
    const requestId = ++menuContentRouteRequestId;
    const resolved = resolveMenuContentRouteTarget(router, to);
    const loaded = (await loadRouteLocation(
      resolved,
    )) as RouteLocationNormalizedLoadedGeneric;

    if (requestId !== menuContentRouteRequestId) {
      return loaded;
    }

    menuContentRouteRef.value = loaded;
    accessStore.setMenuContentRouteFullPath(loaded.fullPath);
    return loaded;
  }

  return {
    clearMenuContentRoute,
    menuContentRoute,
    setMenuContentRoute,
  };
}

export { resolveMenuContentRouteTarget, useMenuContentRoute };
