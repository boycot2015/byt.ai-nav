<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useHotDataStore } from '@/store';
import { Refresh } from '@element-plus/icons-vue';
import HotCard from './HotCard.vue';

const hotDataStore = useHotDataStore();
const loading = ref(false);
const hotData = ref([]);
const fetchHotCate = async () => {
  loading.value = true;
  try {
    const data = await hotDataStore.fetchHotCate();
    hotData.value = data.slice(0, 6);
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.error('获取热点数据失败:', error);
  }
};

onMounted(() => {
  fetchHotCate();
});
</script>
<template>
  <div class="hot-component">
    <el-row :gutter="16">
        <el-col v-for="item in hotData" :key="item.url" :span="24" :xxs="24" :xs="12" :sm="8" :md="6" :lg="4">
            <HotCard class="mb-[16px]" :title="item.title" :type="item.name" />
        </el-col>
    </el-row>
  </div>
</template>
