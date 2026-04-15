import type { RouteRecordRaw } from 'vue-router';

import { mergeRouteModules, traverseTreeValues } from '@vben/utils';

import { coreRoutes, fallbackNotFoundRoute } from './core';

const dynamicRouteFiles = import.meta.glob(
  ['./modules/**/*.ts', '!./modules/external/**/*.ts'],
  {
    eager: true,
  },
);

const externalRouteFiles = import.meta.glob('./modules/external/**/*.ts', {
  eager: true,
});

/** 动态路由 */
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles);

/**
 * 外部路由列表
 * 访问这些页面时不需要走 BasicLayout，也不会参与侧边菜单生成
 */
const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles);

const staticRoutes: RouteRecordRaw[] = [];

/**
 * 初始路由表
 * 由基础路由、外部路由和 404 路由组成
 */
const routes: RouteRecordRaw[] = [
  ...coreRoutes,
  ...externalRoutes,
  fallbackNotFoundRoute,
];

/** 基础路由（登录、注册等） */
const basicRoutes = [...coreRoutes];

/** 这些路由不参与权限守卫 */
const coreRouteNames = traverseTreeValues(basicRoutes, (route) => route.name);

/** 参与权限校验与菜单生成的路由 */
const accessRoutes = [...dynamicRoutes, ...staticRoutes];

export { accessRoutes, coreRouteNames, routes };
