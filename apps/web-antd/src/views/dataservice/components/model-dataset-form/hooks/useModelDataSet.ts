import { onBeforeMount, onMounted, onUnmounted } from 'vue';

import { useGraphFlowStore } from '../store/useGraphFlowStore';

const graphFlowStore = useGraphFlowStore();
// 初始化项目相关信息
export const initModelDataSet = (fn: () => Promise<void>) => {
  onBeforeMount(async () => {});
  onMounted(async () => {
    const dom = document.querySelector('#graph-flow-container');
    const dnd = document.querySelector('#model-resource-tree');
    if (dom) {
      graphFlowStore.containerRef = dom as HTMLElement;
      graphFlowStore.dndContainerRef = dnd as HTMLElement;
    }

    await fn();
  });

  onUnmounted(() => {});
};
