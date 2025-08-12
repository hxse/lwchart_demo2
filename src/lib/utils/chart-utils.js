export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}




/**
 * 从 Map 中找到第一个 paneIndex 为指定值的系列。
 * @param {Map<import('lightweight-charts').ISeriesApi, object>} seriesDataMap - 包含系列数据的 Map。
 * @param {number} targetPaneIndex - 目标 paneIndex 值。
 * @returns {object | undefined} 找到的系列数据对象，如果没找到则返回 undefined。
 */
function findSeriesByPaneIndex(seriesDataMap, targetPaneIndex) {
    // 遍历 Map 的所有键值对
    for (const [key, value] of seriesDataMap.entries()) {
        // 检查当前系列的数据是否包含 paneIndex 属性，并且其值是否等于目标值
        if (value && value.index === targetPaneIndex) {
            // 找到了，立即返回该数据对象
            return value.series
        }
    }
    // 没找到返回第一个
    for (const [key, value] of seriesDataMap.entries()) {
        // 检查当前系列的数据是否包含 paneIndex 属性，并且其值是否等于目标值
        // 找到了，立即返回该数据对象
        return value.series
    }

    // 如果遍历完所有元素都没有找到，则返回 undefined
    return undefined;
}

export function syncChartsCrosshair(myCharts) {
    if (myCharts.length < 2) {
        return;
    }

    for (const [index, { chart: sourceChart, seriesMap: sourceSeries }] of myCharts.entries()) {
        sourceChart.subscribeCrosshairMove(param => {
            for (const [targetIndex, { chart: targetChart, seriesMap: targetSeries }] of myCharts.entries()) {

                // 排除当前正在操作的图表
                if (index !== targetIndex) {
                    const firstSeries = findSeriesByPaneIndex(targetSeries, param.paneIndex)

                    if (firstSeries && param.time) {
                        targetChart.setCrosshairPosition(undefined, param.time, firstSeries);
                    } else {
                        targetChart.clearCrosshairPosition()
                    }
                }
            }
        });
    }
}
