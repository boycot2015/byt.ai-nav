<template>
  <div class="top-search-bar">
    <el-input
      size="large"
      class="!backdrop-blur-md"
      ref="searchInput"
      clearable
      v-model="searchQuery"
      placeholder="输入搜索内容"
      @keyup.enter="performSearch"
    >
      <template #prepend>
        <el-select size="large" class="flex-3 w-[85px]" v-model="selectedEngine" placeholder="选择搜索引擎">
          <el-option
            v-for="engine in searchEngines"
            :key="engine.value"
            :label="engine.label"
            :value="engine.value"
          >
            <template #default>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" v-html="engine.icon"></svg>
                <span class="ml-[5px]">{{ engine.label }}</span>
              </div>
            </template>
          </el-option>
        </el-select>
      </template>
      <template #append>
        <el-button @click="performSearch" :icon="Search"></el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
const selectedEngine = ref('bing');
const searchQuery = ref('');

const searchEngines = [
  {
    label: '必应',
    value: 'bing',
    icon: `<path fill="currentColor" d="m10.129 8.596l1.735 4.328l2.77 1.29L19 16.247V11.7z" opacity=".7"/><path fill="currentColor" d="M14.634 14.214L9 17.457V3.4L5 2v17.76L9 22l10-5.753V11.7z"/>`,
    url: 'https://www.bing.com/search?q={query}',
  },
  {
    label: '百度',
    value: 'baidu',
    icon: `<path fill="currentColor" d="M5.926 12.497c2.063-.444 1.782-2.909 1.72-3.448c-.1-.83-1.078-2.282-2.404-2.167c-1.67.15-1.914 2.561-1.914 2.561c-.226 1.115.54 3.497 2.598 3.053m2.191 4.288c-.06.173-.195.616-.079 1.002c.23.866.982.905.982.905h1.08v-2.64H8.944c-.52.154-.77.559-.827.733m1.638-8.422c1.14 0 2.06-1.312 2.06-2.933s-.92-2.93-2.06-2.93c-1.138 0-2.06 1.31-2.06 2.93s.923 2.933 2.06 2.933m4.907.193c1.523.198 2.502-1.427 2.697-2.659c.198-1.23-.784-2.658-1.862-2.904c-1.08-.248-2.43 1.483-2.552 2.61c-.147 1.38.197 2.758 1.717 2.953m0 3.448c-1.865-2.905-4.513-1.723-5.399-.245c-.882 1.477-2.256 2.41-2.452 2.658c-.198.244-2.846 1.673-2.258 4.284c.588 2.609 2.653 2.56 2.653 2.56s1.521.15 3.286-.246c1.766-.391 3.286.098 3.286.098s4.124 1.38 5.253-1.278c1.127-2.66-.638-4.038-.638-4.038s-2.356-1.823-3.731-3.793m-6.007 7.75c-1.158-.231-1.62-1.021-1.677-1.156c-.057-.137-.386-.772-.212-1.853c.5-1.619 1.927-1.735 1.927-1.735h1.427v-1.755l1.216.02v6.479zm4.59-.019c-1.196-.308-1.252-1.158-1.252-1.158v-3.412l1.252-.02v3.066c.076.328.482.387.482.387H15v-3.433h1.331v4.57zm7.453-9.11c0-.59-.49-2.364-2.305-2.364c-1.818 0-2.061 1.675-2.061 2.859c0 1.13.095 2.707 2.354 2.657s2.012-2.56 2.012-3.152"/>`,
    url: 'https://www.baidu.com/s?wd={query}',
  },
  {
    label: '搜狗',
    value: 'sogou',
    icon: `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11.25 16.25h1.5L12 17zM16 14v.5"/><path d="M4.42 11.247A13.2 13.2 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.7 11.7 0 0 0-.493-3.309M8 14v.5"/><path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5c-1.931.722-3.576-.297-3.656-1c-.113-.994 1.177-6.53 4-7c1.923-.321 3.651.845 3.651 2.235A7.5 7.5 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277c2.823.47 4.113 6.006 4 7c-.08.703-1.725 1.722-3.656 1c-1.261-.472-1.855-1.45-2.239-2.5"/></g>`,
    url: 'https://www.sogou.com/web?query={query}',
  },
  {
    label: '360',
    value: '360',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14"><!-- Icon from Streamline by Streamline - https://creativecommons.org/licenses/by/4.0/ --><path fill="currentColor" fill-rule="evenodd" d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0M6.5 4.625a1.875 1.875 0 1 0 0 3.75a1.875 1.875 0 0 0 0-3.75M3.375 6.5a3.125 3.125 0 1 1 5.732 1.723l1.335 1.335a.625.625 0 1 1-.884.884L8.223 9.107A3.125 3.125 0 0 1 3.375 6.5" clip-rule="evenodd"/>`,
    url: 'https://www.so.com/s?q={query}',
  },
  {
    label: '谷歌',
    value: 'google',
    icon: `<path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81"/>`,
    url: 'https://www.google.com/search?q={query}',
  },
  {
    label: '雅虎',
    value: 'yahoo',
    icon: `<path fill="currentColor" d="M10.5 7.59L8.16 13.2L5.85 7.59H2l4.29 9.64l-1.54 3.47H8.5l5.74-13.11zm4.5 5.14c-1.37 0-2.41 1.04-2.41 2.27c0 1.17 1 2.16 2.34 2.16c1.39 0 2.43-1.03 2.43-2.26c0-1.21-1-2.17-2.36-2.17m2.72-9.43l-3.83 8.59h4.28L22 3.3z"/>`,
    url: 'https://search.yahoo.com/search?p={query}',
  },
];
const searchInput = ref(null);
const performSearch = () => {
  const engine = searchEngines.find(e => e.value === selectedEngine.value);
  if (engine) {
    const searchUrl = engine.url.replace('{query}', encodeURIComponent(searchQuery.value));
    window.open(searchUrl, '_blank');
  }
};
onMounted(() => {
  searchInput.value.focus();
})
</script>

<style scoped>
.icon {
  margin-right: 4px;
  vertical-align: middle;
}
</style>