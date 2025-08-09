export function getUniqueArray(templateArray) {
  const uniqueArray = [...new Set(templateArray.flat())];
  return uniqueArray
}
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
        Found ${positions.length} cells but expected ${expectedCellsCount} for a rectangle from (${minR},${minC}) to (${maxR},${maxC}).`);
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

/**
 * 计算用于 Svelte 组件的网格分隔条数据。
 */
export function calculateSplitData(templateArray) {
  const columnGutters = [];
  const rowGutters = [];
  const allNames = [];

  const columnCount = templateArray[0].length;
  const rowCount = templateArray.length;


  for (let colIdx = 0; colIdx < columnCount - 1; colIdx++) {
    const colTrack = colIdx * 2 + 1;
    for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
      if (templateArray[rowIdx][colIdx] != templateArray[rowIdx][colIdx + 1]) {
        const rowTrack = rowIdx * 2 + 1;
        const name = `col-${colTrack}-row-${rowTrack}`;
        const gridArea = `${rowTrack} / ${colTrack + 1} / ${rowTrack + 2} / ${colTrack + 2}`;
        columnGutters.push({ track: colTrack, name, gridArea: gridArea });
      }
    }
  }

  for (let rowIdx = 0; rowIdx < rowCount - 1; rowIdx++) {
    const rowTrack = rowIdx * 2 + 1;
    for (let colIdx = 0; colIdx < columnCount; colIdx++) {
      if (templateArray[rowIdx][colIdx] != templateArray[rowIdx + 1][colIdx]) {

        const colTrack = colIdx * 2 + 1;
        const name = `row-${rowTrack}-col-${colTrack}`;
        const gridArea = `${rowTrack + 1} / ${colTrack} / ${rowTrack + 2} / ${colTrack + 2}`;
        rowGutters.push({ track: rowTrack, name, gridArea: gridArea });
      }
    }
  }

  return { columnGutters, rowGutters, allNames: [...rowGutters, ...columnGutters] };
}

/**
 * 根据二维网格区域数组计算每个区域的 CSS grid-area 坐标。
 */
export function calculateGridAreas(gridArray) {
  if (!gridArray || gridArray.length === 0) {
    return {};
  }

  const areas = {};

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

/**
 * 根据特定规则转换 grid-area 字典。
 */
export function transformGridAreas(gridAreas) {
  const newGridAreas = {};

  for (const areaName in gridAreas) {
    if (Object.prototype.hasOwnProperty.call(gridAreas, areaName)) {
      const area = gridAreas[areaName];

      const newArea = area.map((value, index) => {
        if (index === 0 || index === 1) {
          return value === 1 ? value : value * 2 - 1;
        }
        if (index === 2 || index === 3) {
          return value === 1 ? value : (value - 1) * 2;
        }
        return value; // 防止意外情况
      });

      newGridAreas[areaName] = newArea;
    }
  }

  return newGridAreas;
}

export function formatGridArea(areaArray) {
  // 确保输入是有效的数组
  if (!Array.isArray(areaArray) || areaArray.length !== 4) {
    console.error("Invalid grid area array provided. Expected a 4-element array.");
    return "";
  }
  return `${areaArray[0]} / ${areaArray[1]} / ${areaArray[2]} / ${areaArray[3]}`;
}



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
