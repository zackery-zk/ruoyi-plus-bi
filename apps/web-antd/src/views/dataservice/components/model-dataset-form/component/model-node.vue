<script lang="tsx" setup>
import type { ID } from '#/api/common';
import type { ModelNodeField } from '#/api/dataservice/model-dataset/model';

import { computed, h, inject, markRaw, onBeforeMount, ref } from 'vue';

import { SvgResTableIcon } from '@vben/icons';

import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  MoreOutlined,
  SettingOutlined,
  UpOutlined,
} from '@antdv-next/icons';
import { Button } from 'antdv-next';

import ResourceIcon from '#/views/resource/resource-icon.vue';

import { useModelDataSetStore } from '../store/useModelDataSetStore';

interface NodeData {
  resId: ID;
  nodeId: ID;
  nodeAlias: string;
  nodeType: string;
  fields: ModelNodeField[];
}

const emit = defineEmits<{
  (e: 'selectField', data: { nodeFieldId: ID; nodeId: ID }): void;
}>();

const modelDataSetStore = useModelDataSetStore();

const getNode = inject<any>('getNode');
const isFold = ref(false);
const grapNode = ref<any>();
const modelNode = ref<NodeData>({
  resId: '',
  nodeId: '',
  nodeAlias: '',
  nodeType: '',
  fields: [],
});

const nodeHeight = computed(() => {
  if (!isFold.value) {
    return 40;
  }
  if (modelNode.value) {
    const h1 = modelNode.value.fields.length * 45;
    if (h1 > 300) {
      return 300;
    }
    return Number(h1);
  }
  return 300;
});

// 折叠
function handleFold(event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  if (modelNode.value && grapNode.value.id && !isFold.value) {
    modelNode.value.fields = modelDataSetStore.getModelNodeField(
      grapNode.value.id,
    );
  }
  isFold.value = !isFold.value;

  grapNode.value.prop('size', {
    width: 220,
    height: nodeHeight.value,
  });
}
const options = [
  {
    label: '预览数据',
    key: 'previewData',
    icon: markRaw(EyeOutlined),
  },
  {
    label: '编辑',
    key: 'edit',
    icon: markRaw(EditOutlined),
  },
  {
    label: '删除',
    key: 'delete',
    icon: markRaw(DeleteOutlined),
  },
  {
    label: '属性',
    key: 'attribute',
    icon: markRaw(SettingOutlined),
  },
];

function handleSelectField(item: ModelNodeField) {
  if (modelNode.value) {
    emit('selectField', {
      nodeId: modelNode.value.nodeId,
      nodeFieldId: item.fieldId,
    });
  }
}

const Style = computed(() => {
  return {
    width: '220px',
    height: nodeHeight.value + 'px',
  };
});

onBeforeMount(() => {
  grapNode.value = getNode();
  modelNode.value = grapNode.value.getData();
});
</script>

<template>
  <div
    class="bi-model-node"
    :style="Style"
    :class="{ selected: modelDataSetStore.selectNodeId === grapNode?.id }"
  >
    <div class="w-full h-full flex flex-col">
      <div
        class="w-full bi-model-node-header h-[40px] border-border"
        :class="{ 'border-b': isFold }"
      >
        <a-flex align="center" :gap="1">
          <div class="bi-model-node-icon">
            <div class="bi-model-node-icon-content">
              <SvgResTableIcon />
            </div>
          </div>
          <div class="text-xs font-bold">
            {{ modelNode?.nodeAlias }}
          </div>
        </a-flex>

        <a-flex align="center" :gap="1">
          <Button
            class="bi-model-node-fold-button"
            size="small"
            type="text"
            @click="handleFold"
          >
            <UpOutlined v-if="isFold" class="pointer-events-none" />
            <DownOutlined v-else class="pointer-events-none" />
          </Button>
          <Button size="small" type="text" :icon="h(MoreOutlined)" />
          &nbsp;
        </a-flex>
      </div>

      <div class="nb-data-model-node-fields flex-1" v-if="isFold">
        <div
          v-for="item in modelNode?.fields"
          :key="item.fieldId"
          class="nb-data-model-node-field flex items-center"
          @click="handleSelectField(item)"
        >
          <div class="w-20px">
            <Button
              :icon="
                h(ResourceIcon, {
                  resType: item.fieldType,
                  aggType: item.aggType,
                  dataType: item.dataType,
                })
              "
              size="small"
              type="text"
              class="!text-primary"
            />
          </div>

          <div class="h-full flex flex-1 items-center text-xs">
            {{ item.fieldAlias || item.fieldName }}
          </div>

          <div class="w-[20px]">
              <Button size="small" type="text">
                <template #icon>
                    <EyeOutlined v-if="item.visible" />
                    <EyeInvisibleOutlined v-else />
                </template>
              </Button>
          </div>
          <!--
 <NTooltip trigger="hover">
            <template #trigger>
              <div class="w-24px">
                <SvgIcon icon="clarity:connect-line" class="h-1.3em w-1.3em color-primary" />
              </div>
            </template>
            <span>字段已关联</span>
          </NTooltip>
-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bi-model-node.selected {
  outline: 1px solid hsl(var(--primary));
}

.bi-model-node {
  background: hsl(var(--background));
  border-radius: var(--ant-border-radius);
  box-shadow: var(--ant-box-shadow);

  .bi-model-node-header {
    display: flex;
    justify-content: space-between;

    .bi-model-node-icon {
      width: 40px;
      height: 100%;
      padding: 6px;

      .bi-model-node-icon-content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: hsl(var(--primary));
        border-radius: var(--ant-border-radius);

        svg {
          width: 1em;
          height: 1em;
          color: #fff;
        }
      }
    }
  }

  .nb-data-model-node-fields {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 0;
    padding: 3px;
    overflow: auto;

    .nb-data-model-node-field {
      padding: 3px;
      cursor: pointer;
      border-radius: var(--ant-border-radius);
    }

    .nb-data-model-node-field.selected {
      background-color: hsl(var(--primary-50));
    }

    .nb-data-model-node-field.selected:hover {
      background-color: hsl(var(--primary-50));
    }

    .nb-data-model-node-field:hover {
      background-color: hsl(var(--background-deep));
    }
  }

  .nb-data-model-node-fields::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    appearance: none;
  }
}
</style>
