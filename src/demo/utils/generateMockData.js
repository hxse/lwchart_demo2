/**
 * 生成随机游走方式的 K 线数据，模拟真实的波动和反转。
 * @param {number} count 要生成的 K 线数量。
 * @param {string} interval 时间间隔（例如 '15m', '1h', '1d'）。
 * @param {number} [initialPrice=100] 初始价格。
 * @param {number} [volatility=5] 波动性因子，值越大，价格波动越剧烈。
 * @returns {Array<Object>} K 线数据数组。
 */
export function generateCandlestickData(count, interval, initialPrice = 100, volatility = 5) {
    const data = [];
    let lastClose = Number(initialPrice);
    if (isNaN(lastClose)) {
        lastClose = 100;
    }

    // 辅助函数：将时间间隔转换为秒数
    function intervalToSeconds(interval) {
        const [value, unit] = [parseInt(interval.slice(0, -1)), interval.slice(-1)];
        switch (unit) {
            case 'm': return value * 60;
            case 'h': return value * 60 * 60;
            case 'd': return value * 60 * 60 * 24;
            case 'w': return value * 60 * 60 * 24 * 7;
            default: throw new Error(`不支持的时间间隔单位: ${unit}`);
        }
    }

    // 将时间戳作为起始点（例如 2018-10-19 00:00:00 UTC）
    let currentTime = 1539907200;
    const intervalSeconds = intervalToSeconds(interval);

    // 封装四舍五入的函数
    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

    for (let i = 0; i < count; i++) {
        if (isNaN(lastClose)) {
            lastClose = 100;
        }

        const open = lastClose + (Math.random() - 0.5) * volatility * 0.2;
        const close = open + (Math.random() - 0.5) * volatility;
        const high = Math.max(open, close) + Math.random() * volatility * 0.3;
        const low = Math.min(open, close) - Math.random() * volatility * 0.3;

        data.push({
            time: currentTime,
            open: roundToTwoDecimals(open),
            high: roundToTwoDecimals(high),
            low: roundToTwoDecimals(low),
            close: roundToTwoDecimals(close),
        });

        lastClose = close;
        currentTime += intervalSeconds;
    }

    return data;
}

export function simulateVolume(ohlc, { upColor = "rgb(38,166,154,1)", downColor = "rgb(239,83,80,1)" }) {
    if (!Array.isArray(ohlc) || ohlc.length === 0) {
        return [];
    }

    // 封装一个四舍五入到整数的函数
    const roundToInteger = (num) => Math.round(num);

    return ohlc.map((item, index) => {
        let volume = 0;
        if (index > 0) {
            // 成交量与价格变化量正相关
            const priceChange = Math.abs(item.close - ohlc[index - 1].close);
            volume = roundToInteger(priceChange * 1000 + Math.random() * 500);
        } else {
            // 第一个数据点随机生成
            volume = roundToInteger(Math.random() * 1000);
        }

        // 根据开盘价和收盘价判断颜色
        const color = item.close >= item.open ? upColor : downColor;

        return { time: item.time, value: volume, color: color };
    });
}

export function calculateSMA(ohlcv, period) {
    if (!Array.isArray(ohlcv) || ohlcv.length === 0 || period <= 0) {
        return [];
    }

    const smaResults = [];
    for (let i = period - 1; i < ohlcv.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += ohlcv[i - j].close;
        }
        const value = sum / period;
        smaResults.push({ time: ohlcv[i].time, value: value });
    }

    return smaResults;
}

export function calculateRSI(ohlc, period) {
    if (!Array.isArray(ohlc) || ohlc.length <= period) {
        return [];
    }

    const rsiResults = [];
    const gains = [];
    const losses = [];
    let avgGain;
    let avgLoss;

    for (let i = 1; i < ohlc.length; i++) {
        const change = ohlc[i].close - ohlc[i - 1].close;
        gains.push(Math.max(0, change));
        losses.push(Math.max(0, -change));

        if (i === period) {
            avgGain = gains.slice(0, period).reduce((sum, g) => sum + g, 0) / period;
            avgLoss = losses.slice(0, period).reduce((sum, l) => sum + l, 0) / period;
        } else if (i > period) {
            if (typeof avgGain !== "undefined" && typeof avgLoss !== "undefined") {
                avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
                avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
            }
        }

        if (i >= period && typeof avgGain !== "undefined" && typeof avgLoss !== "undefined") {
            let rsi;
            if (avgLoss === 0) {
                rsi = 100;
            } else if (avgGain === 0) {
                rsi = 0;
            } else {
                const rs = avgGain / avgLoss;
                rsi = 100 - 100 / (1 + rs);
            }
            rsiResults.push({ time: ohlc[i].time, value: rsi });
        }
    }

    return rsiResults;
}
