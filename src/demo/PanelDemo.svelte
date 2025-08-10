<script>
  import Panel from "../lib/Panel.svelte";
  import Text from "./Text.svelte";
  import { removeURLParameter, returnHome } from "./utils/handleUrl.js";

  import { getContext } from "svelte";

  const demoObj = getContext("demoObj");

  let panelOptions1 = {
    template: `a a b
               c c b
               d e e`,
    splitSize: "5px",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr",
    showDefaultColors: true,
    children: [...Array(5).keys()].map((i) => ({ component: Text, props: { text: `layout 0 test ${i}` } })),
  };

  let panelOptions2 = {
    template: `a b
               a c`,
    splitSize: "5px",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    showDefaultColors: true,
    children: [...Array(3).keys()].map((i) => ({ component: Text, props: { text: `layout 1 test ${i}` } })),
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

<div class="container">
  <div class="top-bar">
    <button onclick={() => returnHome(demoObj)}> 返回主页 </button>
    <button onclick={changeTemplate}>更改布局</button>
  </div>
  <div class="panel">
    <Panel {...panelOptions} />
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
  .panel {
    flex: 1;
  }
</style>
