# 桌面导航项目说明  
![](https://file.boycot.top/images/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_6442751f-98a8-47c8-bcf2-34b850ed893a.png)
## 技术栈  
- **Vite**：快速构建工具  
- **Element Plus**：UI组件库  
- **Pinia**：状态管理  
- **PNPM**：包管理工具  
- **TwindCSS**：原子化CSS  

## 功能需求  

1. **书签导入**  
    - 支持导入Google Chrome、Edge、Firefox书签。  

2. **新增应用**  
    - 弹框新增字段：  
      - 名称  
      - 链接  
      - 网站图标（支持动态获取）。  

3. **桌面图标拖拽**  
    - 引入第三方拖拽插件实现动画拖拽功能。  

4. **背景设置**  
    - 支持右键菜单或头部设置替换背景。  
    - 弹框列表选择分类下的壁纸。  
    - 壁纸源：  
      - API地址：<https://api.boycot.top/api/wallpaper>  
      - 分类参数：`source`  
         - 可选值：`bing` | `360` | `birdpaper`。  

5. **顶部搜索框**  
    - 支持搜索引擎：  
      - 必应  
      - 百度  
      - 搜狗  
    - 搜索结果在新窗口打开。  

6. **热点卡片组件**  
    - 显示热点数据。  
    - 支持点击图标刷新数据。  
    - 支持系统定时刷新（默认60秒）。  
    - 数据源：  
      - 热点数据：<https://api.boycot.top/api/hots>  
      - 分类参数：从<https://api.boycot.top/api/hots/cate>获取`name`。  

7. **数据管理**  
    - 使用Pinia管理项目数据。  
    - 使用第三方插件持久化数据到本地存储。  

## 项目结构  
- **src**  
  - **components**：组件目录  
  - **store**：Pinia状态管理  
  - **assets**：静态资源  
  - **utils**：工具函数  

## 安装与运行  

```bash  
# 安装依赖  
pnpm install  

# 启动项目  
pnpm dev  
```  
