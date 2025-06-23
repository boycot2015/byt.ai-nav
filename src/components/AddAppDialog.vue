<template>
  <el-dialog append-to-body v-model="dialogVisible" width="380px" :title="`${appText}设置`" @open="onOpen" @close="onClose">
    <el-form ref="appFormRef" :model="appForm" class="min-w-[280px]" label-width="100px">
      <el-form-item prop="title" :label="`${appText}名称:`" required :rules="[{ required: true, message: appText + '不能为空' }]">
        <el-input v-model="appForm.title" :placeholder="`请输入${appText}名称`"></el-input>
      </el-form-item>
      <el-form-item prop="url" label="应用链接:" v-if="showIcons" :rules="[{ required: true, message: '链接不能为空' }]">
        <el-input v-model="appForm.url" :disabled="!showIcons" placeholder="请输入应用链接"></el-input>
      </el-form-item>
      <el-form-item prop="icon" :label="`${appText}图标:`">
        <el-input v-model="appForm.icon" placeholder="如：https://baidu.com/favicon.ico">
          <template #append v-if="showIcons">
            <el-button :disabled="!appForm.url" class="!flex items-center" @click="getIcon" :loading="loading">动态获取</el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click.stop="onClose">取消</el-button>
        <el-button type="primary" @click="submitApp">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useAppStore } from '@/store';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    rowData: {
        type: Object,
        default: () => ({}),
    },
    title: {
        type: String,
        default: '应用',
    },
});
const dialogVisible = ref(props.visible);
const appFormRef = ref(null);
const showIcons = computed(() => (!props.rowData.id && !props.title) || (props.rowData?.links && !props.rowData?.links.length));
const appText = computed(() => props.rowData.id && (props.rowData?.links && props.rowData?.links.length) ? '文件夹' : props.title || '应用');
const appForm = ref({
  id: '',
  title: '',
  url: '',
  icon: '',
  ...props.rowData
});
const emit = defineEmits(["update:modelValue", 'confirm']);
watch(props, () => {
  dialogVisible.value = props.visible;
})
const appStore = useAppStore();

const getIcon = async () => {
  try {
    loading.value = true;
    const response = await appStore.getFaviconUrl(appForm.value.url);
    loading.value = false;
    appForm.value.icon = response;
    response && ElMessage.success('图标获取成功');
    !response && ElMessage.error('获取图标失败');
  } catch (error) {
    console.error('获取图标失败:', error);
  }
};

const submitApp = () => {
  appFormRef.value.validate((valid) => {
    if (!valid) {
      ElMessage.error('请填写完整信息');
      return;
    }
    !appForm.value.id && appStore.addApp(appForm.value);
    emit('confirm', appForm.value);
    onClose();
  });
};
const onOpen = () => {
  appForm.value = {
    ...props.rowData
  };
}
const onClose = () => {
  appFormRef.value?.resetFields();
  dialogVisible.value = false;
  emit("update:modelValue", false);
}
</script>

<style scoped>
</style>