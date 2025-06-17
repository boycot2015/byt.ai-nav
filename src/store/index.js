import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as cheerio from 'cheerio';
import axios from 'axios';
const setHtmlStyleProp = (color) => {
  /** 变量前缀 */
  const PRE = '--el-color-primary'
  /** 浅色变量前缀 */
  const PRE_LIGHT = `${PRE}-light`
  /** 深色变量前缀 */
  const PRE_DARK = `${PRE}-dark`
  /** 色阶 */
  const Levels = [3, 5, 7, 8, 9]

  /** 白色 */
  const WHITE = '#FFFFFF'
  /** 黑色 */
  const BLACK = '#000000'

  const html = document.documentElement
  /**
   * 混合颜色
   */
  const mix = (color1, color2, weight) => {
      weight = Math.max(Math.min(Number(weight), 1), 0)
      const r1 = parseInt(color1.substring(1, 3), 16)
      const g1 = parseInt(color1.substring(3, 5), 16)
      const b1 = parseInt(color1.substring(5, 7), 16)
      const r2 = parseInt(color2.substring(1, 3), 16)
      const g2 = parseInt(color2.substring(3, 5), 16)
      const b2 = parseInt(color2.substring(5, 7), 16)
      const r = Math.round(r1 * (1 - weight) + r2 * weight)
      const g = Math.round(g1 * (1 - weight) + g2 * weight)
      const b = Math.round(b1 * (1 - weight) + b2 * weight)
      const _r = ('0' + (r || 0).toString(16)).slice(-2)
      const _g = ('0' + (g || 0).toString(16)).slice(-2)
      const _b = ('0' + (b || 0).toString(16)).slice(-2)
      return '#' + _r + _g + _b
  }
  // 设置主要颜色变量 --el-color-primary
  html.style.setProperty(PRE, color)
  // 循环设置色阶颜色
  // --el-color-primary-light-${level}
  Levels.forEach(level => {
      html.style.setProperty(`${PRE_LIGHT}-${level}`, mix(color, WHITE, level * 0.1))
  })
  // 设置主要暗色
  // --el-color-primary-dark-2
  const dark = mix(color, BLACK, 0.2)
  html.style.setProperty(`${PRE_DARK}-2`, dark)
}
// 获取图标数据
const getFaviconUrl = async (url) => {
  try {
    const res = await axios.get('https://api.boycot.top/api/apiDocs?url=' + url);
    const $ = cheerio.load(res.data?.data || '<html></html>');
    let newUrl = $('link[rel="icon"]').prop('href') ||
    $('link[rel="shortcut icon"]').prop('href') ||
    $('link[rel="icon shortcut"]').prop('href') ||
    $('link[rel="apple-touch-icon"]').prop('href') ||
    '';
    return (newUrl.includes('http') || newUrl.includes('https')) ? newUrl : newUrl ? (new URL(newUrl, url).protocol + '//' + new URL(newUrl, url).host + (newUrl.includes('/') ? newUrl : '/' + newUrl)) : '';
  } catch (error) {
    console.error('获取favicon失败:', error);
    return '';
  }
};
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
  const bookmarks = ref([]);

  const importBookmarks = (content) => {
    useAppStore().updateIcons([])
    // 解析不同浏览器书签文件
    try {
      const parsed = parseHtml(content);
      bookmarks.value = parsed;
      const covert = (el, index) => {
        return {
          ...el,
          id: Date.now() + index,
          links: el.links?.map((item, idx) => covert(item, index + '-' + idx)) || []
        }
      }
      useAppStore().updateIcons(bookmarks.value?.map(covert))
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
    bgSource: 'birdpaper',
    themeColor: '#409eff',
    copyright: ' © 2025 Powered By boycot',
    version: '1.0.0'
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
  const setTheme = (themeColor) => {
    appData.value.themeColor = themeColor;
    setHtmlStyleProp(themeColor);
  };
  const setCopyright = (copyright) => {
    appData.value.copyright = copyright;
  }
  const setBgSource = (source) => {
    appData.value.bgSource = source;
  };
  return {
    appData,
    addApp,
    updateIcons,
    setBackground,
    setBgSource,
    getFaviconUrl,
    setTheme,
    setCopyright
  };
}, {
  persist: true // 启用持久化
});

// 热点数据管理
export const useHotDataStore = defineStore('hotData', () => {
  const hotData = ref([]);
  const hotCate = ref({});

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
  
  return {
    hotData,
    hotCate,
    fetchHotData,
    fetchHotCate
  };
}, {
  persist: true // 启用持久化
});