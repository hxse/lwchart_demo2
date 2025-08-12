<script>
  import Panel from "./Panel.svelte";
  import LWChart from "./LWChart.svelte";

  let props = $props();
  let options = $derived(props.options);
  let panelSelect = $derived(props.panelSelect);
  let panelOptions = $derived({
    ...panelSelect.panelOptions,
    splitSize: "4px",
    showDefaultColors: false,
    children: [...Array(panelSelect.chartCount).keys()].map((i) => ({ component: LWChart, props: { options } })),
  });
</script>

<div class="chart">
  <Panel {...panelOptions} style="width: 100%; height: 100%;" />
</div>

<style>
  .chart {
    width: 100%;
    height: 100%;
  }
</style>
