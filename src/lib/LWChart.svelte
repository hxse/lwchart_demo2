<script>
  import { onMount } from "svelte";
  import { createChart, CandlestickSeries, HistogramSeries, LineSeries, ColorType } from "lightweight-charts";
  import Panel from "./Panel.svelte";
  import { calculateGridAreas } from "./utils/grid-area-calculator";

  let props = $props();
  let options = $derived(props.options);

  let container;
  let chart;
  const seriesMap = new Map();

  onMount(() => {
    if (!container) return;

    const chartOptions = {
      addDefaultPane: false,
      layout: {
        panes: {
          enableResize: true,
        },
      },
    };
    chart = createChart(container, chartOptions);

    // 4. 确保图表内容自适应
    chart.timeScale().fitContent();

    // 确保在组件销毁时清理图表
    return () => chart.remove();
  });

  // 使用 $effect 监听 options 的变化
  $effect(() => {
    // 1. 根据 options 移除不再显示的系列
    // 移除放在添加之前,否则会出问题
    for (const [key, { series, pane, index }] of seriesMap.entries()) {
      if (!options[key].show) {
        chart.removeSeries(series);
        seriesMap.delete(key);

        // 如果窗格现在为空，并且我们不希望保留空窗格，可以考虑移除它
        if (pane.getSeries().length === 0) {
          chart.removePane(index);
        }
      }
    }

    // 2. 根据 options 添加或更新系列
    for (const [key, value] of Object.entries(options)) {
      if (value.show) {
        // 如果系列不存在，则添加它
        if (!seriesMap.has(key)) {
          while (chart.panes().length <= value.index) {
            chart.addPane(true);
          }
          const pane = chart.panes()[value.index];

          let series;
          if (key == "candle") {
            series = pane.addSeries(CandlestickSeries, {});
          } else if (key == "volume") {
            series = pane.addSeries(HistogramSeries, {
              priceFormat: {
                type: "volume",
              },
              priceScaleId: "",
            });
            series.priceScale().applyOptions({
              scaleMargins: {
                top: 0.8,
                bottom: 0,
              },
            });
          } else if (["sma", "rsi"].includes(key)) {
            series = pane.addSeries(LineSeries, {});
          }

          if (series) {
            seriesMap.set(key, {
              series,
              pane,
              index: value.index,
            });
          }
        }

        // 确保数据已设置或更新
        const { series } = seriesMap.get(key);
        series.setData(value.data);
      }
    }

    // 3. 调整窗格大小（如果需要）
    const newPanes = chart.panes();
    for (const [index, value] of options.panelSize.entries()) {
      if (newPanes[index]) {
        newPanes[index].setStretchFactor(value);
      }
    }
  });
</script>

<div bind:this={container} style="width: 100%; height: 100%;"></div>
