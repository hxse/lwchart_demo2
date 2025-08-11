<script>
  import Panel from "./Panel.svelte";
  import LWChart from "./LWChart.svelte";

  let props = $props();
  let options = $derived(props.options);

  let panelOptions1 = {
    template: `a a b
               c c b
               d e e`,
    splitSize: "5px",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr",
    showDefaultColors: false,
    children: [...Array(5).keys()].map((i) => ({ component: LWChart, props: { options } })),
  };

  let panelOptions2 = {
    template: `a b
               a c`,
    splitSize: "5px",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    showDefaultColors: false,
    children: [...Array(3).keys()].map((i) => ({ component: LWChart, props: { options } })),
  };

  let panelOptions = $state(panelOptions1);

  function changeTemplate() {
    const t1 = panelOptions1.template;
    const c1 = panelOptions1.gridTemplateColumns;
    const r1 = panelOptions1.gridTemplateRows;
    const d1 = panelOptions1.children;

    const t2 = panelOptions2.template;
    const c2 = panelOptions2.gridTemplateColumns;
    const r2 = panelOptions2.gridTemplateRows;
    const d2 = panelOptions2.children;

    if (panelOptions.template == t1) {
      panelOptions.template = t2;
      panelOptions.gridTemplateColumns = c2;
      panelOptions.gridTemplateRows = r2;
      panelOptions.children = d2;
    } else {
      panelOptions.template = t1;
      panelOptions.gridTemplateColumns = c1;
      panelOptions.gridTemplateRows = r1;
      panelOptions.children = d1;
    }

    console.log("Template changed to a new layout.");
  }
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
