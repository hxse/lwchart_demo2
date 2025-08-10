/**
 * 将分割条尺寸插入到网格模板列字符串中。
 * @param {string} gridTemplate - 原始的 grid-template-columns 字符串，如 "1fr 1fr 1fr"。
 * @param {string} splitSize - 分割条的尺寸，如 "1px"。
 * @returns {string} - 插入分割条后的字符串，如 "1fr 1px 1fr 1px 1fr"。
 */
export function insertSplitSize(gridTemplate, splitSize) {
    if (!gridTemplate || !splitSize) {
        return gridTemplate; // 如果参数无效，返回原始模板
    }

    // 1. 将原始模板字符串按空格分割成数组
    const templateArray = gridTemplate.split(' ');

    // 2. 在每个元素之间插入 splitSize
    const result = templateArray.flatMap((item, index) => {
        // 如果不是最后一个元素，就插入 splitSize
        if (index < templateArray.length - 1) {
            return [item, splitSize];
        }
        // 最后一个元素后面不加
        return [item];
    });

    // 3. 将数组重新连接成字符串并返回
    return result.join(' ');
}
