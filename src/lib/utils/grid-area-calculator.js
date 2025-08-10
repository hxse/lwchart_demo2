/**
 * 根据二维网格区域数组计算每个区域的 CSS grid-area 坐标。
 * @param {Array<Array<string>>} gridArray - 表示网格布局的二维数组。
 * @returns {Object.<string, number[]>} - 包含每个区域名称及其对应的 [row-start, column-start, row-end, column-end] 坐标的字典。
 */
export function calculateGridAreas(gridArray) {
    if (!gridArray || gridArray.length === 0) {
        return {};
    }

    const areas = /** @type {Object.<string, number[]>} */ ({});

    // 1. 遍历网格，找到每个区域的起始点和终点
    for (let r = 0; r < gridArray.length; r++) {
        for (let c = 0; c < gridArray[r].length; c++) {
            const areaName = gridArray[r][c];

            // 如果区域名是 '.' 或者已经处理过，则跳过
            if (areaName === '.' || areas[areaName]) {
                continue;
            }

            // 初始化当前区域的边界
            let minR = r;
            let minC = c;
            let maxR = r;
            let maxC = c;

            // 2. 找到当前区域的完整矩形范围
            // 扩展行
            let currentRow = r;
            while (currentRow < gridArray.length && gridArray[currentRow][c] === areaName) {
                currentRow++;
            }
            maxR = currentRow - 1;

            // 扩展列
            let currentCol = c;
            while (currentCol < gridArray[0].length && gridArray[r][currentCol] === areaName) {
                currentCol++;
            }
            maxC = currentCol - 1;

            // 3. 记录网格线的坐标 (基于1开始的索引)
            // row-start = minR + 1
            // column-start = minC + 1
            // row-end = maxR + 2 (因为要跨过 maxR 所在单元格)
            // column-end = maxC + 2 (因为要跨过 maxC 所在单元格)
            areas[areaName] = [minR + 1, minC + 1, maxR + 2, maxC + 2];
        }
    }

    return areas;
}
