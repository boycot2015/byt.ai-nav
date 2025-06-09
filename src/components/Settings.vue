<template>
  <div>
    <el-button type="primary" @click="openBackgroundDialog" :icon="Setting">设置</el-button>
    <el-dialog v-model="dialogVisible" width="50vw" title="设置" append-to-body>
      <el-tabs v-model="activeTab" class="min-w-[320px]">
        <el-tab-pane name="bg" label="背景设置">
          <div class="flex flex-col">
            <div class="mb-[12px] text-right items-center self-end flex">
              <span>来源：</span>
              <el-radio-group size="small" v-model="selectedSource">
                <el-radio-button value="bing">必应</el-radio-button>
                <el-radio-button value="360">360</el-radio-button>
                <el-radio-button value="birdpaper">Birdpaper</el-radio-button>
              </el-radio-group>
            </div>
            <el-scrollbar style="height: 40vh" v-loading="bgLoading">
              <div :infinite-scroll-immediate="false" v-infinite-scroll="() => fetchWallpapers(true)">
                <el-row :gutter="0">
                  <el-col v-for="wallpaper in wallpapers
          " :key="wallpaper.url" :span="12" :md="8" :lg="6" :xl="3">
                    <el-image :src="wallpaper.url" fit="cover" @click="(e) => setBackground(wallpaper.url, e)" class="wallpaper-preview"></el-image>
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
            <el-form-item class="flex items-center" label="版权：">
                <el-input class="flex-3" v-model="copyright" @input="appStore.setCopyright"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <!-- <template #footer>
          <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </template> -->
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAppStore } from '@/store';
import { Setting } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
const timer = ref(null);
const dialogVisible = ref(false);
const bgLoading = ref(false);
const appStore = useAppStore();
const selectedSource = ref(appStore.appData?.bgSource || 'bing');
const themeColor = ref(appStore.appData?.themeColor || '#ff9900');
const copyright = ref(appStore.appData?.copyright || '');
const wallpapers = ref([]);
const activeTab = ref('bg');
const page = ref(1);
const openBackgroundDialog = () => {
  dialogVisible.value = true;
};
const emit = defineEmits(['change']);
 
const fetchWallpapers = async (pageChange = false) => {
  bgLoading.value = true;
  page.value = pageChange ? page.value + 1 : 1;
  try {
    const response = await fetch(`https://api.boycot.top/api/wallpaper?source=${selectedSource.value}&page=${page.value}`);
    let wallpaper = await response.json();
    wallpapers.value = page.value > 1 ? [...wallpapers.value, ...wallpaper.data?.list] : wallpaper.data?.list || [];
    bgLoading.value = false;
    randomBg();
  } catch (error) {
    bgLoading.value = false;
    console.error('获取壁纸失败:', error);
  }
};

const setBackground = (url, e) => {
  if(e) clearInterval(timer.value);
  emit('change', url);
  appStore.setBackground(url);
  if(e) dialogVisible.value = false;
  if(e) ElMessage({
    message: '设置成功',
    type: 'success',
  });
  if(e) timer.value = setInterval(() => {
    randomBg();
  }, 30000);
};

const randomBg = () => {
  setBackground(wallpapers.value[Math.floor(Math.random() * wallpapers.value.length)].url);
}
fetchWallpapers();
watch(selectedSource, () => {
  appStore.setBgSource(selectedSource.value);
  fetchWallpapers();
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