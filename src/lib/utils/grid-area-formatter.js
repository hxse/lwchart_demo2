/**
 * 将一个包含四个数字的数组格式化为 CSS grid-area 字符串。
 * @param {number[]} areaArray - 包含 [row-start, column-start, row-end, column-end] 的数组。
 * @returns {string} - 格式化后的 CSS grid-area 字符串，例如 "1 / 2 / 3 / 4"。
 */
export function formatGridArea(areaArray) {
  // 确保输入是有效的数组
  if (!Array.isArray(areaArray) || areaArray.length !== 4) {
    console.error("Invalid grid area array provided. Expected a 4-element array.");
    return "";
  }
  return `${areaArray[0]} / ${areaArray[1]} / ${areaArray[2]} / ${areaArray[3]}`;
}
