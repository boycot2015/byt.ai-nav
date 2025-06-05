<template>
  <el-upload
    class="upload-app w-full text-[32px] h-[32px] text-[#333] flex justify-center items-center py-8 cursor-pointer text-center border-b-[1px] border-dashed border-b-[#333]"
    action=""
    accept=".html,.xml,.json"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="handleFileChange"
  >
    <el-icon><UploadFilled  /></el-icon>
  </el-upload>
</template>

<script setup>
import { ref } from 'vue';
import { useBookmarkStore } from '@/store';
import { UploadFilled } from '@element-plus/icons-vue';
const file = ref(null);
const bookmarkStore = useBookmarkStore();

const handleFileChange = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    bookmarkStore.importBookmarks(content);
  };
  reader.readAsText(file.raw);
};
</script>

<style scoped>
</style>