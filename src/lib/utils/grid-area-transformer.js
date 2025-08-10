/**
 * 根据特定规则转换 grid-area 字典。
 * @param {Object.<string, number[]>} gridAreas - 包含每个区域名称及其对应的 [row-start, column-start, row-end, column-end] 坐标的字典。
 * @returns {Object.<string, number[]>} - 转换后的 grid-area 字典。
 */
export function transformGridAreas(gridAreas) {
    const newGridAreas = /** @type {Object.<string, number[]>} */ ({});

    for (const areaName in gridAreas) {
        if (Object.prototype.hasOwnProperty.call(gridAreas, areaName)) {
            const area = gridAreas[areaName];

            const newArea = area.map((value, index) => {
                if (index === 0 || index === 1) { // row-start, column-start
                    return value === 1 ? value : value * 2 - 1;
                }
                if (index === 2 || index === 3) { // row-end, column-end
                    return value === 1 ? value : (value - 1) * 2;
                }
                return value; // 防止意外情况
            });

            newGridAreas[areaName] = newArea;
        }
    }

    return newGridAreas;
}
