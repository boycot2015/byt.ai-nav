<template>
  <el-dialog append-to-body v-model="dialogVisible" title="应用设置" @open="onOpen" @close="onClose">
    <el-form :model="appForm" class="min-w-[280px]" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="appForm.title"></el-input>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="appForm.url"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="appForm.icon">
          <template #append>
            <el-button :disabled="!appForm.url" @click="getIcon">动态获取</el-button>
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
import { ref, watch } from 'vue';
import { useAppStore } from '@/store';
import { ElMessage } from 'element-plus';
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    rowData: {
        type: Object,
        default: () => ({}),
    },
});
const dialogVisible = ref(props.visible);
const appForm = ref({
  title: '',
  url: '',
  icon: '',
  ...props.rowData
});
const emit = defineEmits(["update:modelValue"]);
watch(props, () => {
  dialogVisible.value = props.visible;
})
const appStore = useAppStore();

const getIcon = async () => {
  try {
    const response = await appStore.getFaviconUrl(appForm.value.url);
    appForm.value.icon = response;
    ElMessage.success('图标获取成功');
  } catch (error) {
    console.error('获取图标失败:', error);
  }
};

const submitApp = () => {
  appStore.addApp(appForm.value);
  onClose();
};
const onOpen = () => {
  appForm.value = {
    name: '',
    link: '',
    icon: '',
    ...props.rowData
  };
}
const onClose = () => {
  dialogVisible.value = false;
  emit("update:modelValue", false);
  appForm.value = {
    name: '',
    link: '',
    icon: ''
  };
}
</script>

<style scoped>
</style>