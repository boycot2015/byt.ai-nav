<template>
  <el-dialog v-model="dialogVisible" title="新增应用">
    <el-form :model="appForm" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="appForm.name"></el-input>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="appForm.link"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="appForm.icon"></el-input>
        <el-button @click="getIcon">动态获取</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitApp">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '@/store';

const dialogVisible = ref(false);
const appForm = ref({
  name: '',
  link: '',
  icon: ''
});
const appStore = useAppStore();

const getIcon = async () => {
  try {
    const response = await fetch(`https://www.google.com/s2/favicons?domain=${appForm.value.link}`);
    appForm.value.icon = response.url;
  } catch (error) {
    console.error('获取图标失败:', error);
  }
};

const submitApp = () => {
  appStore.addApp(appForm.value);
  dialogVisible.value = false;
  appForm.value = {
    name: '',
    link: '',
    icon: ''
  };
};
</script>

<style scoped>
</style>