<script>
  import Panel from "../lib/Panel.svelte";
  import Text from "./Text.svelte";
  import LWChart from "../lib/LWChart.svelte";
  import { generateCandlestickData, simulateVolume, calculateSMA, calculateRSI } from "./utils/generateMockData.js";
  import { removeURLParameter, returnHome } from "./utils/handleUrl.js";
  import { getContext } from "svelte";

  const demoObj = getContext("demoObj");

  const candleData = generateCandlestickData(200, "15m");
  let alpha = 0.7;
  const volumeData = simulateVolume(candleData, {
    upColor: `rgb(38,166,154,${alpha})`,
    downColor: `rgb(239,83,80,${alpha})`,
  });
  const smaData = calculateSMA(candleData, 14);
  const rsiData = calculateRSI(candleData, 14);

  let options = $state({
    candle: { data: candleData, index: 0, show: true },
    volume: { data: volumeData, index: 0, show: true },
    sma: { data: smaData, index: 0, show: true },
    rsi: { data: rsiData, index: 1, show: true },
    panelSize: [0.7, 0.3],
  });
  function _c() {
    // options.candle.show = !options.candle.show;
    options.volume.show = !options.volume.show;
    options.sma.show = !options.sma.show;
    options.rsi.show = !options.rsi.show;
  }
</script>

<div class="container">
  <div class="top-bar">
    <button onclick={() => returnHome(demoObj)}> 返回主页 </button>
    <button onclick={_c}>switch</button>
  </div>
  <div class="chart">
    <LWChart {options} />
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
    flex-shrink: 0;
  }
  /* 只对 Panel2 的根元素应用 flex: 1; */
  .chart {
    flex: 1;
  }
</style>
