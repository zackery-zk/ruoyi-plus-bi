<script setup lang="ts">
import type { ResourceForm } from '#/api/resource/model';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { ResourceTypeEnum } from '@vben/constants';
import { cloneDeep } from '@vben/utils';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  createResource,
  getResourceById,
  updateResource,
} from '#/api/resource';

import { modalSchema } from './data';

const emit = defineEmits<{
  reload: [resId: number | string, resPid: number | string];
}>();

const isUpdate = ref(false);
const title = ref<string>('属性');

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    // 默认占满两列
    formItemClass: 'col-span-2',
    // 默认label宽度 px
    labelWidth: 120,
    // 通用配置项 会影响到所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  schema: modalSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);

    const { resId, resPid, pName, resType } = modalApi.getData() as {
      pName?: string;
      resId?: string;
      resPid?: string;
      resType?: string;
    };
    isUpdate.value = !!resId;

    if (isUpdate.value && resId) {
      const record = await getResourceById(resId);
      await formApi.setValues(record);
    } else {
      await formApi.setValues({
        resPid,
        pName,
        resType,
      });
      if (resType === ResourceTypeEnum.FOLDER) {
        title.value = '新建文件夹';
      }
    }

    modalApi.modalLoading(false);
  },
});

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const data = cloneDeep(await formApi.getValues());

    if (isUpdate.value) {
      await updateResource(data as ResourceForm);
      console.log( data.resId, data.resPid)
      emit('reload', data.resId, data.resPid);
    } else {
      const result = await createResource(data as ResourceForm);
      emit('reload', result, data.resPid);
    }
    message.success('操作成功');

    await handleCancel();
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  modalApi.close();
  await formApi.resetForm();
}
</script>

<template>
  <BasicModal
    :close-on-click-modal="false"
    :title="title"
    class="w-[550px]"
    draggable
  >
    <BasicForm />
  </BasicModal>
</template>
