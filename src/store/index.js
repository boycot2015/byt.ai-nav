import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as cheerio from 'cheerio';
import axios from 'axios';
// 书签管理
export const useBookmarkStore = defineStore('bookmark', () => {
  // 解析书签数据
  function parseHtml(html, selector = 'body > dl > dt') {
    try {
      const $ = cheerio.load(html);
      const links = [];
      $(selector).find('> dl > dt').each(async (_, element) => {
        try {
          const $el = $(element);
          const title = $el.find('>h3').text().trim() || $el.find('a').text().trim();
          const url = $el.find('>a').prop('href');
          links.push({
            title: title,
            url: url,
            links: $el ? parseHtml($el.html(), element) : undefined
          });
        } catch (error) {
          console.error('解析时出错:', error);
        }
      });
      
      return links;
    } catch (error) {
      console.error('解析列表时出错:', error);
      return [];
    }
  }
  // 解析书签数据
  const getFaviconUrl = async (url) => {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      return (
        $('link[rel="icon"]').prop('href') ||
        $('link[rel="shortcut icon"]').prop('href') ||
        ''
      );
    } catch (error) {
      console.error('获取favicon失败:', error);
      return '';
    }
  };
  const bookmarks = ref([]);

  const importBookmarks = (content) => {
    useAppStore().updateIcons([])
    // 解析不同浏览器书签文件
    try {
      const parsed = parseHtml(content);
      bookmarks.value = parsed;
      useAppStore().updateIcons(bookmarks.value?.map(el => ({ ...el, id: Date.now() })))
    } catch (error) {
      console.error('解析书签失败:', error);
    }
  };

  return {
    bookmarks,
    importBookmarks,
    getFaviconUrl
  };
}, {
  persist: true // 启用持久化
});

// 应用管理
export const useAppStore = defineStore('app', () => {
  const appData = ref({
    icons: [],
    backgroundUrl: '',
    bgSource: 'bing'
  });

  const addApp = (app) => {
    appData.value.icons.push({
      ...app,
      id: Date.now()
    });
  };

  const updateIcons = (newIcons) => {
    appData.value.icons = newIcons;
  };
  const setBackground = (url) => {
    appData.value.backgroundUrl = url;
  };
  const setBgSource = (source) => {
    appData.value.bgSource = source;
  };
  return {
    appData,
    addApp,
    updateIcons,
    setBackground,
    setBgSource
  };
}, {
  persist: true // 启用持久化
});

// 热点数据管理
export const useHotDataStore = defineStore('hotData', () => {
  const hotData = ref([]);
  const hotCate = ref([]);

  const fetchHotData = async ({ page = 1, cate = 'weibo' } = {}) => {
    try {
      const response = await fetch(`https://api.boycot.top/api/hots?page=${page}&name=${cate}`);
      hotData.value = await response.json();
      return hotData.value.data;
    } catch (error) {
      console.error('获取热点数据失败:', error);
      throw error;
    }
  };
  const fetchHotCate = async () => {
    try {
      const response = await fetch(`https://api.boycot.top/api/hots/cate`);
      hotCate.value = await response.json();
      return hotCate.value.data;
    } catch (error) {
      console.error('获取热点数据失败:', error);
      throw error;
    }
  };
  console.log(hotCate, 'hotCate');
  
  return {
    hotData,
    hotCate,
    fetchHotData,
    fetchHotCate
  };
}, {
  persist: true // 启用持久化
});