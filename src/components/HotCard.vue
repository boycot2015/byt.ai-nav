<template>
  <div class="hot-card">
    <el-card size="small" v-loading="loading" >
      <template #header>
        <div class="card-header">
          <span>{{title}}</span>
          <el-icon class="cursor-pointer" @click="refreshData"><Refresh /></el-icon>
        </div>
      </template>
      <div class="min-h-[200px]">
        <el-scrollbar height="200px" v-if="hotData[0]">
          <el-timeline class="pl-[5px]" v-if="hotData[0] && hotData[0].time">
            <el-timeline-item
              v-for="(item, index) in hotData"
              :key="index"
              :type="index===0 ? 'primary' : 'info'"
              :timestamp="item.time"
            >
              <el-link :href="item.url" target="_blank">{{ item.title }}</el-link>
            </el-timeline-item>
          </el-timeline>
          <div v-else>
          <el-link class="my-1" v-for="(item, index) in hotData" :key="index" :href="item.url" target="_blank"><span class="line-clamp-2">{{index+1}}、{{ item.title }}</span></el-link>
          </div>
        </el-scrollbar>
        <el-empty :image-size="70" v-else-if="!loading"></el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useHotDataStore } from '@/store';
import { Refresh } from '@element-plus/icons-vue';
const props = defineProps({
  title: {
    type: String,
    default: '热点数据',
  },
  type: {
    type: String,
    default: 'baidu',
  },
})
const loading = ref(true);
const hotData = ref([]);
const hotDataStore = useHotDataStore();
let timer = null;

const fetchHotData = async (auto = false) => {
  loading.value = !auto;
  if (hotDataStore.hotData.length > 0 && !auto) {
    hotData.value = hotDataStore.hotData;
    loading.value = false;
    return;
  }
  try {
    const data = await hotDataStore.fetchHotData({ cate: props.type });
    hotData.value = data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.error('获取热点数据失败:', error);
  }
};

const refreshData = () => {
  fetchHotData();
};

onMounted(() => {
  fetchHotData();
  timer = setInterval(() => fetchHotData(true), 60000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>