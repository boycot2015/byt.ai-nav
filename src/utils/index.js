

/**
 * 获取用户当前地理位置并通过高德地图 API 获取所在城市名称。
 * 
 * @returns {Promise<string>} 返回一个 Promise，解析为当前所在城市的名称。
 * @throws {Error} 如果获取地理位置或城市信息失败，将抛出错误。
 * 
 * 错误场景：
 * - 用户拒绝地理定位请求。
 * - 位置信息不可用。
 * - 获取位置信息超时。
 * - 发生未知错误。
 * - 请求高德地图 API 出错。
 * - 高德地图 API 返回错误信息。
 * 
 * 注意：
 * - 需要在项目中配置高德地图 API Key，并通过 `import.meta.env.VITE_AMAP_KEY` 访问。
 * - 浏览器需要支持地理定位功能。
 */
export function getCityByGeolocation() {
    return new Promise((resolve, reject) => {
        // 替换为你自己的高德地图 API Key
        const amapKey = import.meta.env.VITE_AMAP_KEY;
        // console.info('amapKey', amapKey)
        const geocoderUrl = `https://restapi.amap.com/v3/ip?key=${amapKey}`;
        fetch(geocoderUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === '1') {
                    const city = data.city;
                    resolve(city);
                } else {
                    reject(new Error(`获取城市信息失败: ${data.info}`));
                }
            })
            .catch(error => {
                reject(new Error(`请求出错: ${error.message}`));
            });
    });
}
