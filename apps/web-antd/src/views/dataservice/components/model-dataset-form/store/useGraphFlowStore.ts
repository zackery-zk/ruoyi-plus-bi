import type { ID } from '#/api/common';
import type { ResourceVO } from '#/api/resource/model';

import { h, ref, shallowRef } from 'vue';

import { Dnd, Graph, Node, Shape } from '@antv/x6';
import { register } from '@antv/x6-vue-shape';
import { defineStore } from 'pinia';

import ModelNode from '../component/model-node.vue';
import { emitter, EMITTER_EVENT } from '../emitter/useEmitter';
import { useModelDataSetStore } from './useModelDataSetStore';
export const useGraphFlowStore = defineStore('graphFlowStore', () => {
  const modelDataSetStore = useModelDataSetStore();

  // 画布容器元素
  const containerRef = ref<HTMLElement | null>();

  //左侧拖拽容器元素
  const dndContainerRef = ref<HTMLElement | null>();

  // 画布实例
  const graphInstance = shallowRef<Graph | null>(null);

  const dndInstance = shallowRef<Dnd | null>(null);

  function initGraphFlowCanvas() {
    if (containerRef.value && dndContainerRef.value) {
      const graph = new Graph({
        container: containerRef.value,
        background: {
          color: 'rgb(251 252 254)', // 设置画布背景颜色
        },
        panning: true,
        mousewheel: {
          enabled: true,
          global: true,
          factor: 1.05,
          modifiers: ['ctrl'],
        },
        grid: {
          size: 10, // 网格大小 10px
          visible: true, // 渲染网格背景
        },
        autoResize: true,
        connecting: {
          // 是否允许连接到画布空白位置的点，默认为 true，
          allowBlank: false,
          // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 true 。
          allowLoop: false,
          // // 是否允许边链接到另一个边，默认为 true 。
          allowEdge: false,
          // 是否允许在相同的起始节点和终止之间创建多条边
          allowMulti: false,
          // 当停止拖动边的时候根据 validateEdge 返回值来判断边是否生效，如果返回 false , 该边会被清除。
          validateEdge: function () {
            return true;
          },
          // 创建边的默认样式
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#B1BBCD',
                },
              },
            });
          },
        },
      });
      graphInstance.value = graph;
      dndInstance.value = new Dnd({
        target: graph,
        scaled: true,
        dndContainer: dndContainerRef.value,
        getDropNode(node) {
          const { resId } = node.getData();
          const nodeId = node.id;
          modelDataSetStore.addModelNode(resId, nodeId);
          return node.clone({ keepId: true });
        },
      });

      // Scroller 插件可以使画布支持滚动
      // graphInstance.value.use(
      //   new Scroller({
      //     enabled: true,
      //     pannable: true
      //   })
      // );
      graphInstance.value.zoomTo(1);
      graph.centerContent();
      // 注册自定义组件
      register({
        shape: 'custom-vue-node',
        width: 220,
        height: 43,
        component: {
          render() {
            return h(ModelNode, {
              onSelectField: (data: { nodeFieldId: ID; nodeId: ID }) => {},
            });
          },
        },
        rx: 6,
        ry: 6,
        ports: {
          groups: {
            top: {
              position: 'top',
              attrs: {
                circle: {
                  magnet: true,
                  stroke: '#028FA6',
                  r: 5,
                },
              },
            },
            bottom: {
              position: 'bottom',
              attrs: {
                circle: {
                  magnet: true,
                  stroke: '#028FA6',
                  r: 5,
                },
              },
            },
            left: {
              position: 'left',
              attrs: {
                circle: {
                  magnet: true,
                  stroke: '#028FA6',
                  r: 5,
                },
              },
            },
            right: {
              position: 'right',
              attrs: {
                circle: {
                  magnet: true,
                  stroke: '#028FA6',
                  r: 5,
                },
              },
            },
          },
        },
      });

      // 节点点击事件
      graphInstance.value.on('node:click', ({ e, node }) => {
        if (e.target.classList.contains('bi-model-node-fold-button')) {
          return;
        }
        const nodeId = node.id;
        clearSelectStatus();
        setGraphNodeSelect(nodeId);
        modelDataSetStore.selectNodeId = nodeId;
      });

      /** 节点的右键菜单事件 */
      graphInstance.value.on('node:contextmenu', ({ e, node }) => {
        emitter.emit(EMITTER_EVENT.NODE_CONTEXT_MENU, { e, node });
      });

      // 画布空白区域
      graphInstance.value.on('blank:click', () => {});

      // 边的移入事件
      graphInstance.value.on('edge:mouseenter', ({ e: _e, edge }) => {
        edge.attr('line/stroke', 'var(--n-color-target)');
      });
      // 边的移出事件
      graphInstance.value.on('edge:mouseleave', ({ e: _e, edge }) => {});

      /**
       * 边的双击事件
       * TODO 设置边的选中状态
       */
      graphInstance.value.on('edge:dblclick', ({ e: _e, edge }) => {});
    }
  }

  // 添加节点
  async function addGraphNode(data: ResourceVO, event: MouseEvent) {
    if (graphInstance.value) {
      const node = graphInstance.value.createNode({
        shape: 'custom-vue-node',
        width: 220,
        height: 40,
        data: {
          resId: data.resId,
          nodeAlias: data.resAlias,
          nodeType: data.resType,
        },
      });
      dndInstance.value?.start(node, event);
    }
  }

  /**设置节点选中 */
  function setGraphNodeSelect(nodeId: ID) {
    const node = getNode(nodeId) as unknown as Node;
    if (node) {
      node.prop('ports/items', [
        {
          id: `${node.id}_port_top`,
          group: 'top',
        },
        {
          id: `${node.id}_port_bottom`,
          group: 'bottom',
        },
        {
          id: `${node.id}_port_left`,
          group: 'left',
        },
        {
          id: `${node.id}_port_right`,
          group: 'right',
        },
      ]);
    }
  }

  /** 清除选中状态 */
  function clearSelectStatus() {
    // 移除选中节点的port
    if (modelDataSetStore.selectNodeId) {
      const node = getNode(modelDataSetStore.selectNodeId) as unknown as Node;
      if (node) {
        node.removePort(`${node.id}_port_top`);
        node.removePort(`${node.id}_port_bottom`);
        node.removePort(`${node.id}_port_left`);
        node.removePort(`${node.id}_port_right`);
      }
    }
  }

  /** 获取节点 */
  function getNode(id: ID) {
    return graphInstance.value?.getCellById(id as string);
  }
  return {
    containerRef,
    dndContainerRef,
    graphInstance,
    dndInstance,

    initGraphFlowCanvas,
    addGraphNode,
  };
});
