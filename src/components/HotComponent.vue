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
  if (hotDataStore.hotCate?.data?.length > 0) {
    hotData.value = hotDataStore.hotCate.data;
    loading.value = false;
    return;
  }
  try {
    const data = await hotDataStore.fetchHotCate();
    hotData.value = data;
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
    <!-- motion-blur -->
    <el-carousel :interval="6000" indicator-position="none" class="hidden xl:block" type="" :cardScale="0.95">
      <el-carousel-item v-for="item in 3" :key="item">
        <el-row :gutter="16" class="justify-center">
            <el-col v-for="item in hotData.slice(6 * (item - 1), 6 * (item - 1) + 6)" :key="item.url" :span="24" :xxs="24" :xs="12" :sm="8" :md="6" :lg="4">
                <HotCard class="mb-[16px] backdrop-blur-lg" :title="item.title" :type="item.name" />
            </el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>
    <el-row :gutter="16" class="xl:hidden flex">
        <el-col v-for="item in hotData" :key="item.url" :span="24" :xxs="24" :xs="12" :sm="8" :md="6" :lg="4">
            <HotCard class="mb-[16px] backdrop-blur-lg" :title="item.title" :type="item.name" />
        </el-col>
    </el-row>
  </div>
</template>
