<template>
  <div class="main relative min-w-[320px]" @contextmenu.prevent="(e) => emitContext(e, { name: 'setting-menu' })" v-contextmenu="{name: 'setting-menu'}">
    <div class="top-bar drap-shadow sticky w-[100%] text-[#fff] top-[0px] left-[0px] z-1000 backdrop-blur-lg flex justify-between px-[20px] py-[5px]">
      <div class="logo">ai导航</div>
      <Settings class="z-999" ref="settingRef" @change="onSettingChange" />
    </div>
    <div class="container relative z-10 px-[20px] xl:px-0 min-h-[calc(100vh-100px)]">
        <div class="max-w-[1000px] m-auto mb-[30px]">
          <div class="flex items-center">
            <TimeComponent class="flex-3" />
            <WeatherComponent />
          </div>
          <TopSearchBar />
        </div>
        <div class="transition transition-all duration-500" ref="transitionRef"></div>
        <el-collapse ref="collapseRef" v-model="activeNames" @change="handleChange">
          <el-collapse-item title="应用" name="1" :icon="CaretRight">
            <template #title>
              <div class="drop-shadow">应用</div>
            </template>
            <template #icon>
              <span class="flex items-center" @click.stop="appVisible = true">
                <el-icon><Plus /></el-icon> 添加
              </span>
            </template>
            <DesktopIcons class="my-[0px]">
              <BookmarkImport />
            </DesktopIcons>
          </el-collapse-item>
          <el-collapse-item title="热点资讯" name="2" :icon="CaretRight">
            <template #title>
              <div class="drop-shadow">热点资讯</div>
            </template>
            <HotComponent />
          </el-collapse-item>
        </el-collapse>
    </div>
    <footer class="drap-shadow relative z-10 text-[#fff] text-center mb-2">
      {{ appStore.appData.copyright }}
    </footer>
    <div :class="`bg transition fixed top-[0px] left-[0px] h-full w-full z-1 ${isBgChange && 'active'}`" :style="{background: `url(${backgroundUrl}) center/cover no-repeat fixed`}"></div>
    <AddAppDialog v-model="appVisible" />
    <context-menu name="setting-menu">
      <context-menu-item @itemClickHandle="openSetting"><div class="flex items-center"><el-icon class="mr-2"><Setting /></el-icon>设置</div></context-menu-item>
      <context-menu-item @itemClickHandle="onRefresh"><div class="flex items-center"><el-icon class="mr-2"><Refresh /></el-icon>刷新</div></context-menu-item>
      <context-menu-item @itemClickHandle="onRefreshBg"><div class="flex items-center"><el-icon class="mr-2"><Refresh /></el-icon>更换壁纸</div></context-menu-item>
    </context-menu>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject, computed } from 'vue';
import TopSearchBar from './components/TopSearchBar.vue';
import TimeComponent from './components/TimeComponent.vue';
import Settings from './components/Settings.vue';
import BookmarkImport from './components/BookmarkImport.vue';
import AddAppDialog from './components/AddAppDialog.vue';
import DesktopIcons from './components/DesktopIcons.vue';
import HotComponent from './components/HotComponent.vue';
import WeatherComponent from './components/WeatherComponent.vue';
import { useAppStore } from '@/store';
import { Refresh, Setting, CaretRight, Plus } from '@element-plus/icons-vue';

const appVisible = ref(false);
const activeNames = ref(['1', '2']);
const collapseRef = ref(null);
const transitionRef = ref(null);
const handleChange = () => {
  if (window.innerWidth < 768) return (activeNames.value = ['1', '2'])
  transitionRef.value.style.height = collapseRef.value ? `${collapseRef.value.$el.offsetHeight || 0}px` : '0px'
  if (activeNames.value.length === 2) {
    transitionRef.value.style.height = '0px';
  }
  if (activeNames.value.length === 1) {
    transitionRef.value.style.height = collapseRef.value ? `calc(50vh - ${collapseRef.value.$el.offsetHeight || 0}px)` : '0px'
  }
}
const settingRef = ref(null);
const emitContext = inject('emitContext')
const isBgChange = ref(false);
const appStore = useAppStore();

const backgroundUrl = ref(appStore.appData.backgroundUrl || '');
const onSettingChange = (url) => {
  isBgChange.value = true;
  const img = new Image();
  img.src = url;
  img.onload = () => {
    setTimeout(() => {
      backgroundUrl.value = url;
    }, 300);
    setTimeout(() => {
      isBgChange.value = false;
      // document.body.style.background = `url(${url}) center/cover no-repeat fixed`
    }, 600);
  };
};
const openSetting = () => {
  settingRef.value.openBackgroundDialog()
}
const onRefresh = () => {
  window.location.reload();
}
const onRefreshBg = () => {
  settingRef.value.randomBg()
}
onMounted(() => {
  if (backgroundUrl.value) {
    onSettingChange(backgroundUrl.value);
  }
  transitionRef.value.style.height = '0px'
});
</script>

<style scoped>
.bg.active {
    animation: scale .6s ease-in-out;
}
@keyframes scale {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(1.1);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
.container {
  max-width: 1300px;
  margin: 0 auto;
}
</style>