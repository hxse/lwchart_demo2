<script>
  import ChartPanel from "../lib/ChartPanel.svelte";
  import { generateCandlestickData, simulateVolume, calculateSMA, calculateRSI } from "./utils/generateMockData.js";
  import { removeURLParameter, returnHome } from "./utils/handleUrl.js";
  import { getContext } from "svelte";

  const demoObj = getContext("demoObj");

  function getIndicators() {
    const candleData = generateCandlestickData(200, "15m");
    let alpha = 0.7;
    const volumeData = simulateVolume(candleData, {
      upColor: `rgb(38,166,154,${alpha})`,
      downColor: `rgb(239,83,80,${alpha})`,
    });
    const smaData = calculateSMA(candleData, 14);
    const rsiData = calculateRSI(candleData, 14);
    return { candleData, volumeData, smaData, rsiData };
  }
  const indicators = getIndicators();

  let options = $state({
    candle: { data: indicators.candleData, index: 0, show: true },
    volume: { data: indicators.volumeData, index: 0, show: true },
    sma: { data: indicators.smaData, index: 0, show: true },
    rsi: { data: indicators.rsiData, index: 1, show: true },
    panelSize: [0.7, 0.3],
  });
  function toggleIndicators() {
    // options.candle.show = !options.candle.show;
    options.volume.show = !options.volume.show;
    options.sma.show = !options.sma.show;
    options.rsi.show = !options.rsi.show;
  }
  function updateClose() {
    const lastIdx = options.candle.data.length - 1;
    const data = options.candle.data;
    data[lastIdx] = { ...data[lastIdx], close: data[lastIdx].close * 1.01 };
  }

  function addDataPoint() {
    // 获取当前数据
    const candleData = options.candle.data;

    // 获取最后两个数据点
    const last = candleData[candleData.length - 1];
    const secondLast = candleData[candleData.length - 2];

    // 计算时间间隔和新数据点的值
    const timeInterval = last.time - secondLast.time;
    const newPoint = {
      time: last.time + timeInterval,
      open: last.open * 1.01,
      high: last.high * 1.01,
      low: last.low * 1.01,
      close: last.close * 1.01,
    };

    // 通过创建一个新数组来更新状态
    options.candle.data = [...candleData, newPoint];
  }
  function replaceData() {
    const indicators = getIndicators();

    options.candle.data = [...indicators.candleData];
    options.volume.data = [...indicators.volumeData];
    options.sma.data = [...indicators.smaData];
    options.rsi.data = [...indicators.rsiData];
  }
</script>

<div class="container">
  <div class="top-bar">
    <button onclick={() => returnHome(demoObj)}> 返回主页 </button>
    <button onclick={toggleIndicators}>切换指标 </button>
    <button onclick={updateClose}>更新收盘价</button>
    <button onclick={addDataPoint}>新增k线</button>
    <button onclick={replaceData}>替换k线</button>
  </div>
  <div class="chart">
    <ChartPanel {options} />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
  }
  .top-bar {
    flex-shrink: 0; /* 防止 top-bar 压缩 */
  }
  .chart {
    flex: 1; /* 填充剩余空间 */
    /* width: 100%; */
    overflow: hidden; /* 防止内容溢出影响高度 */
  }
</style>
