<template>
  <div>
    <el-icon :size="20" class="cursor-pointer flex items-center" @click="openBackgroundDialog"><Setting /></el-icon>
    <!-- <el-button type="primary" size="small" @click="openBackgroundDialog" :icon="Setting">设置</el-button> -->
    <el-dialog v-model="dialogVisible" width="50vw" title="设置" append-to-body>
      <el-tabs v-model="activeTab" class="min-w-[320px]">
        <el-tab-pane name="bg" label="背景设置">
          <div class="flex flex-col">
            <div class="mb-[12px] text-right items-center xl:self-end flex">
              <span>来源：</span>
              <el-radio-group size="small" v-model="selectedSource">
                <el-radio-button value="birdpaper">小鸟壁纸</el-radio-button>
                <el-radio-button value="bing">必应</el-radio-button>
                <el-radio-button value="360">360</el-radio-button>
              </el-radio-group>
            </div>
            <el-scrollbar v-loading="bgLoading">
              <div class="rounded h-[50vh]" :infinite-scroll-immediate="true" v-infinite-scroll="fetchWallpapers">
                <el-row :gutter="0">
                  <el-col v-for="wallpaper in wallpapers
          " :key="wallpaper.url" :span="12" :md="8" :lg="6">
          <!-- :preview-src-list="wallpapers.map(el => el.url)"  show-progress -->
                    <el-image lazy :src="wallpaper.url" fit="cover" @click="(e) => setBackground(wallpaper.url, e)" class="wallpaper-preview">
                      <template #placeholder>
                        <el-empty description="图片加载中..."></el-empty>
                      </template>
                    </el-image>
                  </el-col>
                </el-row>
              </div>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane name="base" label="基础设置">
          <el-form label-width="100px">
            <el-form-item class="flex items-center" label="主题色：">
                <el-color-picker class="flex-3" v-model="themeColor" @change="appStore.setTheme"></el-color-picker>
            </el-form-item>
            <el-form-item class="flex items-center" label="背景模糊：">
                <el-switch class="flex-3" v-model="appStore.appData.isBlurBg" @change="(val) => appStore.setBackground(appStore.appData.backgroundUrl, val)"></el-switch>
            </el-form-item>
            <el-form-item class="flex items-center" label="版权：">
                <el-input class="flex-3" v-model="copyright" @input="appStore.setCopyright"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="danger" @click="appStore.reset()">重置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue';
import { useAppStore } from '@/store';
import { Setting } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
const timer = ref(null);
const dialogVisible = ref(false);
const bgLoading = ref(false);
const appStore = useAppStore();
const selectedSource = ref(appStore.appData?.bgSource || 'birdpaper');
const themeColor = computed(() => appStore.appData?.themeColor || '#ff9900');
const copyright = computed(() => appStore.appData?.copyright || '');
const wallpapers = ref([]);
const activeTab = ref('bg');
const page = ref(1);
const openBackgroundDialog = () => {
  dialogVisible.value = true;
};
const emit = defineEmits(['change']);
 
const fetchWallpapers = async (pageChange = true) => {
  bgLoading.value = true;
  page.value = pageChange ? page.value + 1 : 1;
  try {
    const response = await fetch(`https://api.boycot.top/api/wallpaper?source=${selectedSource.value}&page=${page.value}`);
    let wallpaper = await response.json();
    wallpapers.value = page.value > 1 ? [...wallpapers.value, ...wallpaper.data?.list] : wallpaper.data?.list || [];
    bgLoading.value = false;
  } catch (error) {
    bgLoading.value = false;
    console.error('获取壁纸失败:', error);
  }
};

const setBackground = (url = appStore.appData.backgroundUrl, e) => {
  if(e) clearInterval(timer.value);
  emit('change', url);
  appStore.setBackground(url);
  if(e) dialogVisible.value = false;
  if(e) ElMessage({
    message: '设置成功',
    type: 'success',
  });
  if(e) {
    clearInterval(timer.value);
    timer.value = setInterval(() => {
    randomBg();
  }, 30000);
  }
};

const randomBg = () => {
  setBackground(wallpapers.value[Math.floor(Math.random() * wallpapers.value.length)].url);
}
fetchWallpapers(false);
watch(selectedSource, () => {
  page.value = 1;
  appStore.setBgSource(selectedSource.value);
  wallpapers.value = [];
  fetchWallpapers(false);
});
onMounted(() => {
  timer.value = setInterval(() => {
    randomBg();
  }, 30000);
  appStore.setTheme(themeColor.value);
});
onBeforeUnmount(() => {
  clearInterval(timer.value);
});

defineExpose({
  openBackgroundDialog,
  randomBg
});
</script>

<style scoped>
.wallpaper-preview {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>