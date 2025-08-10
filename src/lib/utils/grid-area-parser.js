/**
 * 将 CSS grid-template-areas 字符串解析为二维数组，并进行严格验证。
 * @param {string} areasString - 包含 grid-template-areas 值的字符串。
 * @returns {Array<Array<string>>} - 表示网格布局的二维数组。
 * @throws {Error} - 如果网格不符合矩形结构、区域不连续或区域形状不是矩形，则抛出错误。
 */
export function parseGridTemplateAreas(areasString) {
    const rows = areasString
        .split('\n')
        .map(row => row.trim())
        .filter(row => row.length > 0);

    if (rows.length === 0) {
        return [];
    }

    const grid = rows.map(row => {
        // 修复：确保引号被正确移除
        const cleanedRow = row.replace(/"/g, '');
        return cleanedRow.split(/\s+/).filter(cell => cell.length > 0);
    });

    // 1. 验证网格的矩形结构
    const firstRowLength = grid[0].length;
    if (firstRowLength === 0) {
        throw new Error('Grid-template-areas must not have empty rows or columns.');
    }
    for (let i = 1; i < grid.length; i++) {
        if (grid[i].length !== firstRowLength) {
            throw new Error(`Grid is not a valid rectangle. Row ${i + 1} has ${grid[i].length} columns, but the first row has ${firstRowLength}.`);
        }
    }

    // 2. 验证区域的连续性和矩形形状
    const areaPositions = {};
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const area = grid[r][c];
            if (area === '.') {
                continue;
            }
            if (!areaPositions[area]) {
                areaPositions[area] = [];
            }
            areaPositions[area].push({ r, c });
        }
    }

    for (const area in areaPositions) {
        const positions = areaPositions[area];
        const minR = Math.min(...positions.map(p => p.r));
        const maxR = Math.max(...positions.map(p => p.r));
        const minC = Math.min(...positions.map(p => p.c));
        const maxC = Math.max(...positions.map(p => p.c));

        // 检查所有单元格是否都包含在一个最小的矩形区域内
        const expectedCellsCount = (maxR - minR + 1) * (maxC - minC + 1);
        if (positions.length !== expectedCellsCount) {
            throw new Error(`Area "${area}" is not a continuous rectangle.
        Found ${positions.length} cells but expected ${expectedCellsCount} for a rectangle from (${minR},${minC}) to (${maxC},${maxC}).`);
        }

        // 检查这个矩形区域内的每个单元格是否都属于该区域
        for (let r = minR; r <= maxR; r++) {
            for (let c = minC; c <= maxC; c++) {
                if (grid[r][c] !== area) {
                    throw new Error(`Area "${area}" is not a continuous rectangle.
          The cell at (${r},${c}) is "${grid[r][c]}", but it should be part of area "${area}".`);
                }
            }
        }
    }

    return grid;
}

function testParseGridTemplateAreas() {

    // 示例用法
    const validGrid = `"a a b f"
"c c b f"
"d d e e"`;

    const invalidGrid_nonRectangular = `"a a b"
"c c b f"
"d d e"`;

    const invalidGrid_discontinuous = `"a b a"
"c c c"
"d d d"`;

    const invalidGrid_nonRectangularArea = `"a a b"
"a c b"
"a d d"`;

    console.log("--- 有效的网格 ---");
    try {
        const result = parseGridTemplateAreas(validGrid);
        console.log(result);
    } catch (e) {
        console.error(e.message);
    }

    console.log("\n--- 无效的网格 (非矩形) ---");
    try {
        parseGridTemplateAreas(invalidGrid_nonRectangular);
    } catch (e) {
        console.error(e.message);
    }

    console.log("\n--- 无效的网格 (不连续) ---");
    try {
        parseGridTemplateAreas(invalidGrid_discontinuous);
    } catch (e) {
        console.error(e.message);
    }

    console.log("\n--- 无效的网格 (L形区域) ---");
    try {
        parseGridTemplateAreas(invalidGrid_nonRectangularArea);
    } catch (e) {
        console.error(e.message);
    }
}
