<template>
  <div class="main relative min-w-[320px]">
    <div class="container relative z-10" @contextmenu.prevent="(e) => emitContext(e, { name: 'setting-menu' })" v-contextmenu="{name: 'setting-menu'}">
        <Settings class="fixed z-999 bottom-[70px] right-[5%]" ref="settingRef" @change="onSettingChange" />
        <div class="max-w-[1000px] m-auto mb-[30px]">
          <div class="flex items-center">
            <TimeComponent class="flex-3" />
            <WeatherComponent />
          </div>
          <TopSearchBar />
        </div>
        <HotComponent />
        <DesktopIcons class="my-[40px]">
          <BookmarkImport />
        </DesktopIcons>
    </div>
    <div :class="`bg transition fixed top-[0px] left-[0px] h-full w-full z-9 ${isBgChange && 'active'}`" :style="{background: `url(${backgroundUrl}) center/cover no-repeat fixed`}"></div>
    <AddAppDialog />
    <context-menu name="setting-menu">
      <context-menu-item @itemClickHandle="openSetting"><div class="flex items-center"><el-icon class="mr-2"><Setting /></el-icon>设置</div></context-menu-item>
      <context-menu-item @itemClickHandle="onRefresh"><div class="flex items-center"><el-icon class="mr-2"><Refresh /></el-icon>刷新</div></context-menu-item>
      <context-menu-item @itemClickHandle="onRefreshBg"><div class="flex items-center"><el-icon class="mr-2"><Refresh /></el-icon>更换壁纸</div></context-menu-item>
    </context-menu>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject } from 'vue';
import TopSearchBar from './components/TopSearchBar.vue';
import TimeComponent from './components/TimeComponent.vue';
import Settings from './components/Settings.vue';
import BookmarkImport from './components/BookmarkImport.vue';
import AddAppDialog from './components/AddAppDialog.vue';
import DesktopIcons from './components/DesktopIcons.vue';
import HotComponent from './components/HotComponent.vue';
import WeatherComponent from './components/WeatherComponent.vue';
import { useAppStore } from '@/store';
import { Refresh, Setting } from '@element-plus/icons-vue';

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
});
</script>

<style scoped>
.main {
  /* height: calc(100vh - 40px); */
  padding: 0 20px;
  padding-top: 50px;
}
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