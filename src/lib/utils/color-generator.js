/**
 * 根据数组索引生成一系列更具美感的 HSL 颜色。
 *
 * @param {any[]} array - 任意数组，用于确定生成的颜色数量。
 * @param {object} [options] - 可选参数对象。
 * @param {number} [options.saturation=70] - 饱和度（0-100）。
 * @param {number} [options.lightness=60] - 亮度（0-100）。
 * @param {number} [options.alpha=1] - 不透明度（0-1）。
 * @param {number} [options.startHue=0] - 起始色相（0-360）。
 * @param {number} [options.hueRange=360] - 色相变化范围（0-360）。
 * @returns {string[]} - 包含一系列 hsla() 颜色字符串的数组。
 */
export function generateHslColors(array, options = {}) {
    if (!Array.isArray(array) || array.length === 0) {
        return [];
    }

    const {
        saturation = 70,
        lightness = 60,
        alpha = 1,
        startHue = 0,
        hueRange = 360,
    } = options;

    const colors = [];
    const totalItems = array.length;
    const step = hueRange / totalItems;

    for (let i = 0; i < totalItems; i++) {
        // 根据起始色相和色相范围来计算 hue
        const hue = Math.floor((startHue + i * step) % 360);
        colors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);
    }

    return colors;
}
