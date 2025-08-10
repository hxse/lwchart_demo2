/**
 * 计算用于 Svelte 组件的网格分隔条数据。
 * @param {Array<Array<string>>} templateArray - 表示网格布局的二维数组。
 * @returns {{columnGutters: Array<Object>, rowGutters: Array<Object>, allNames: Array<Object>}} - 包含列分隔条、行分隔条和所有分隔条名称的对象。
 */
export function calculateSplitData(templateArray) {
    const columnGutters = [];
    const rowGutters = [];

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
