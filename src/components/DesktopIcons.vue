<template>
<div class="min-h-[50px] bg-[rgba(255,255,255,.6)] backdrop-blur-md rounded text-center" @contextmenu.stop="(e) => emitContext(e, { name: 'icons-menu-add' })" v-contextmenu="{name: 'icons-menu-add'}">
  <slot></slot>
  <el-scrollbar v-if="icons && icons.length > 0" class="desktop-icons flex" height="100%">
    <draggable
      v-model="icons"
      group="icons"
      class="flex gap-[12px] items-center flex-wrap"
      @end="onDragEnd"
      animation="300"
      fallback-class
      item-key="id"
    >
      <template #item="{ element }">
        <div class="icon-item text-center mx-1 text-[#333] hover:text-[var(--el-color-primary)]" @contextmenu.prevent="(e) => openContextMenu(e, {...element, name: 'icons-menu'})" v-contextmenu="{...element, name: 'icons-menu'}">
          <el-link :href="element.url" target="_blank" v-if="!element.url" class="cursor-pointer drop-shadow" @click="onAppDialogOpen(element)">
            <div class="flex flex-col justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><!-- Icon from Lets Icons by Leonid Tsvetkov - https://creativecommons.org/licenses/by/4.0/ --><path fill="currentColor" fill-rule="evenodd" d="M7 7.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C8.52 4 9.08 4 10.2 4h1.301c.551 0 .827 0 1.082.069a2 2 0 0 1 .631.295c.216.153.393.364.745.787L15.5 7h2.3c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C21 8.52 21 9.08 21 10.2v2.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C19.48 16 18.92 16 17.8 16H8a1 1 0 0 1-1-1zm-2 .82c-.392.023-.67.077-.908.198a2 2 0 0 0-.874.874C3 9.52 3 10.08 3 11.2v2.4c0 2.24 0 3.36.436 4.216a4 4 0 0 0 1.748 1.748C6.04 20 7.16 20 9.4 20h4.4c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874c.121-.238.175-.516.199-.908H8a3 3 0 0 1-3-3z" clip-rule="evenodd"/></svg>
              <span :title="element.title">{{ element.title }}</span>
            </div>
          </el-link>
          <el-link :href="element.url" target="_blank" v-else class="cursor-pointer drop-shadow hover:text-[var(--el-color-primary)]">
            <div class="flex flex-col justify-center items-center">
              <el-image lazy v-if="element.icon" :src="element.icon" :alt="element.title" class="w-[32px]" />
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE --><path fill="currentColor" d="M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>
              <span class="icon-name max-w-[80px]"><span class="line-clamp-1" :title="element.title">{{ element.title }}</span></span>
            </div>
          </el-link>
        </div>
      </template>
    </draggable>
  </el-scrollbar>
  <el-empty :image-size="36" class="text-[#333]" description="请新增或导入书签" v-else></el-empty>
  <context-menu name="icons-menu" class="z-9999">
    <context-menu-item @itemClickHandle="onAdd">编辑</context-menu-item>
    <context-menu-item @itemClickHandle="onDelete" :divider="true">删除</context-menu-item>
  </context-menu>
    <context-menu name="icons-menu-add" class="z-9999">
    <context-menu-item @itemClickHandle="() => onAdd()"><div class="flex items-center"><el-icon class="mr-2"><Plus /></el-icon>新增应用</div></context-menu-item>
    <context-menu-item :divider="true" @itemClickHandle="() => onAdd({typeName: '文件夹'})"><div class="flex items-center"><el-icon class="mr-2"><Plus /></el-icon>新增文件夹</div></context-menu-item>
    <context-menu-item @itemClickHandle="() => onDelete()"><div class="flex items-center"><el-icon class="mr-2 text-[#f56c6c]"><DeleteIcon /></el-icon>清空书签</div></context-menu-item>
  </context-menu>
  <FolderDialog
      v-model="folderDialogVisible"
      :folder-name="currentFolderName"
      :folder-data="currentData"
    />
  <AddAppDialog
    v-model="addAppDialogVisible"
    :row-data="rowData"
    :title="rowData.typeName || '应用'"
    @confirm="onUpdateIcons"
  />
</div>
</template>

<script setup>
import { ref, watch, computed, inject, nextTick } from 'vue';
import draggable from 'vuedraggable';
import { useAppStore } from '@/store';
import { ElMessage, ElMessageBox } from 'element-plus';
import FolderDialog from "./FolderDialog.vue";
import AddAppDialog from "./AddAppDialog.vue";
import { Plus, Delete as DeleteIcon } from '@element-plus/icons-vue';

const emitContext = inject('emitContext')
const appStore = useAppStore();
const icons = ref(appStore.appData.icons);
const sourceIcons = computed(() => appStore.appData.icons);
const currentFolderName = ref('');
const folderDialogVisible = ref(false);
const addAppDialogVisible = ref(false);
const currentData = ref([]);
const rowData = ref({});
watch(sourceIcons, () => {
  icons.value = appStore.appData.icons;
});

const onDragEnd = () => {
  appStore.updateIcons(icons.value);
};
const onAdd = (item) => {
  addAppDialogVisible.value = true;
  rowData.value = item || {};
}
const onDelete = (item) => {
  if (!item) {
    ElMessageBox.confirm('确定要删除所有书签', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      appStore.updateIcons([]);
    }).catch(() => {});
    return;
  }
  const covert = (arr) => {
    return arr.map(el => {
      if (el.links && el.links.length > 0) {
        el.links = covert(el.links);
      }
      return el;
    }).filter(icon => icon.id !== item.id);
  }
  let has = sourceIcons.value.find(icon => icon.id == item.id)
  has && appStore.updateIcons(sourceIcons.value.filter(icon => icon.id !== item.id));
  !has && appStore.updateIcons(covert(sourceIcons.value))
  if (item.id) currentData.value = currentData.value?.filter(link => link.id !== item.id);
  ElMessage.success(`删除成功`);
}
const refresh = () => {
  appStore.updateIcons(sourceIcons.value);
};

function openContextMenu (e, item) {
  e.stopPropagation();
  emitContext(e, { ...item, name: 'icons-menu' })
}
const onAppDialogOpen = (item) => {
  // 实现打开文件夹对话框的逻辑
  currentFolderName.value = item.title;
  currentData.value = '';
  nextTick(() => {
    currentData.value = item.links || [];
    folderDialogVisible.value = true;
  });
}
const onUpdateIcons = (data) => {
  const covert = (arr, params = {}) => {
    return arr.map(el => {
      if (el.links && el.links.length > 0) {
        el.links = covert(el.links, params);
      }
      if (params.id === el.id) {
        for (const key in params) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            el[key] = params[key];
          }
        }
      }
      return el;
    });
  }
  appStore.updateIcons(covert(sourceIcons.value, data));
}
defineExpose({
  onAppDialogOpen,
  openContextMenu
});
</script>

<style scoped>
.desktop-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: move;
}

.icon-img {
  width: 64px;
  height: 64px;
}

.icon-name {
  margin-top: 8px;
  text-align: center;
}
</style>